import { pick } from '../utils';
import { Interceptor, XMLHttpRequestWithParams, URLIndex, Response } from '../request';
import { getAvatar } from './avatar';

export type FontType = 'woff2' | 'woff' | 'ttf';

export enum ProjectRole {
  OWNER = 0,
  ADMIN = 1,
  MEMBER = 2,
  READONLY = 3,
}

export interface ProjectDetail {
  id: number;
  name: string;
  status: null | string;
  description: string;
  create_user_id: string;
  deleted_at: null | string;
  created_at: string;
  updated_at: string;
  font_format: FontType[] | string;
  font_family: string;
  font_is_old: 1;
  guid: null;
  prefix: string;
}

export interface IconDetail {
  id: number;
  name: string;
  projectId: number;
  show_svg: string;
  unicode: string;
  font_class: string;
  freeze: 0;
}

export interface UserDetail {
  avatar: string;
  id: number;
  nid: string;
  nickname: string;
  role: ProjectRole;
}

export interface DetailResponse {
  project: ProjectDetail;
  users: UserDetail[];
  icons: IconDetail[];
  role_in_project: ProjectRole;
}

const processIconDetail = (icons: IconDetail[]) =>
  icons.map((icon) => ({
    name: icon.name,
    class: icon.font_class,
    svg: icon.show_svg.replace(/class="icon" style=".*?"/, ''),
    meta: {
      iconfont: icon.id.toString(),
    },
  }));

const processProjectDetail = (project: ProjectDetail) => {
  return {
    ...pick(project, ['name', 'description', 'created_at', 'deleted_at', 'updated_at', 'prefix']),
    family: project.font_family,
    meta: {
      iconfont: `${project.id}`,
    },
  };
};

const processUserDetail = (users: UserDetail[]) =>
  users.map((user) => {
    const role = (user as any).ProjectUser.role ?? ProjectRole.OWNER;
    return {
      ...pick(user, ['avatar', 'nid', 'nickname']),
      meta: {
        iconfont: user.id,
      },
      role,
    };
  });

export const projectInfo: {
  project: ProjectDetail | undefined;
  users: UserDetail[];
  icons: IconDetail[];
  projectRole: ProjectRole;
} = {
  users: [],
  icons: [],
  projectRole: ProjectRole.READONLY,
  project: undefined,
};

export const hasManagePermission = () =>
  [ProjectRole.ADMIN, ProjectRole.OWNER].includes(+projectInfo.projectRole);

const migrateMessageHandle = (e: MessageEvent<'migrate:start'>) => {
  if (e.data === 'migrate:start') {
    const imageMap = getAvatar();
    const iframe = ($('#icon-pack') as JQuery<HTMLIFrameElement>)[0];
    iframe?.contentWindow?.postMessage({ ...projectInfo, avatars: imageMap }, '*');
  }
};

const handleDetailInfo = ({
  project,
  icons,
  users,
  role_in_project: projectRole,
}: DetailResponse) => {
  Object.assign(projectInfo, {
    project: processProjectDetail(project),
    projectRole,
    icons: processIconDetail(icons),
    users: processUserDetail(users),
  });
  $('#migrate-button').toggle(hasManagePermission());
  window.removeEventListener('message', migrateMessageHandle, true);
  window.addEventListener('message', migrateMessageHandle, false);
};

export const registerDetailInterceptor = () =>
  Interceptor.INSTANCE.register({
    when: (request) => {
      const url = (request as XMLHttpRequestWithParams).openParams[URLIndex];
      return url.startsWith('/api/project/detail.json');
    },
    onload: function (this: XMLHttpRequest) {
      const response = JSON.parse(this.response) as Response<DetailResponse>;
      if (response.code !== 200) {
        return;
      }
      handleDetailInfo(response.data);
    },
  });
