import { pick } from 'lodash-unified';
import { getFingerPrint } from '@icon/utils';

import {
  Project,
  Icon,
  User,
  IProject,
  IUser,
  IIcon,
  Avatar,
  editableProjectKey,
  LogType,
  SubLogType,
} from '~/server/models';
import { ProjectRole } from '~/constant';
import { genPassword } from '~/utils';
import { Types } from 'mongoose';

const transformToMeta = (meta: Record<string, any>) => {
  const result = {} as Record<string, any>;
  Object.keys(meta).forEach((key) => {
    result[key] = meta[key].toString();
  });
  return result;
};

const saveAvatar = async (avatars: Record<string, string>) => {
  const result = {} as Record<string, Types.ObjectId>;
  await Promise.all(
    Object.keys(avatars).map(async (key) => {
      const avatar = avatars[key];
      const fingerprint = getFingerPrint(avatar);
      const avatarDoc = await Avatar.findOneAndUpdate(
        { fingerprint },
        {
          fingerprint,
          src: avatar,
        },
        { upsert: true, new: true }
      );
      result[key.replace(/^(https?:)?/, '')] = avatarDoc.id;
    })
  );
  return result;
};

const saveIcons = (event: import('h3').H3Event, icons: Array<IIcon>, projectId: Types.ObjectId) =>
  Promise.all(
    icons.map(async (icon) => {
      await Icon.findOneAndUpdate(
        { project: projectId, class: icon.class },
        { $setOnInsert: { ...icon, project: projectId } },
        { upsert: true }
      );
      await useLog(event, {
        project: projectId,
        type: LogType.ICON,
        subType: SubLogType.MIGRATE,
        content: {
          name: icon.name,
          meta: JSON.stringify(transformToMeta(icon.meta!)),
        },
      });
    })
  );

const createNewProject = async (
  event: import('h3').H3Event,
  project: IProject,
  users: Array<Omit<IUser, 'avatar'> & { role: ProjectRole; avatar: string }>,
  icons: Array<IIcon>,
  avatars: Record<string, string>
) => {
  const result = await saveAvatar(avatars);
  // 注册用户
  const userDocs = await Promise.all(
    users
      .map(
        (user) =>
          ({
            ...pick(user, ['id', 'nid', 'nickname']),
            avatar: result[user.avatar],
            password: genPassword('@1234567'),
            meta: transformToMeta(user.meta),
          } as IUser)
      )
      .map(async (user) => {
        return await User.findOneAndUpdate(
          pick(user, 'meta'),
          { $setOnInsert: user },
          { upsert: true, new: true }
        );
      })
  );
  const roleMap = users.reduce(
    (pre, cur) => pre.set(cur.nid, cur.role),
    new Map<string, ProjectRole>()
  );
  const projectDocument = {
    ...pick(project, [...editableProjectKey, 'meta']),
    users: userDocs.map((user) => ({
      id: user.id,
      role: roleMap.get(user.nid) ?? ProjectRole.READONLY,
    })),
  };
  const projectDoc = await Project.findOneAndUpdate(
    pick(projectDocument, 'meta'),
    projectDocument,
    { upsert: true, new: true }
  );
  useLog(event, {
    project: projectDoc.id,
    type: LogType.PROJECT,
    subType: SubLogType.MIGRATE,
    content: {
      meta: JSON.stringify(transformToMeta(projectDocument.meta)),
    },
  });
  users.map((user) => {
    useLog(event, {
      project: projectDoc.id,
      type: LogType.PERMISSION,
      subType: SubLogType.MIGRATE,
      content: {
        name: user.nickname,
        role: String(roleMap.get(user.nid) ?? ProjectRole.READONLY),
        meta: JSON.stringify(transformToMeta(user.meta)),
      },
    });
  });
  await saveIcons(event, icons, projectDoc.id);
};

export default defineEventHandler(async (event) => {
  const { project, icons, users, avatars } = (await readBody(event)) as {
    project: IProject;
    users: Array<Omit<IUser, 'avatar'> & { role: ProjectRole; avatar: string }>;
    icons: Array<IIcon>;
    avatars: Record<string, string>;
  };

  const projectQuery = await Project.findOne(pick(project, 'meta'));
  if (projectQuery) {
    await saveIcons(event, icons, projectQuery.id);
  } else {
    await createNewProject(event, project, users, icons, avatars);
  }
  return {
    code: 0,
    data: true,
  };
});
