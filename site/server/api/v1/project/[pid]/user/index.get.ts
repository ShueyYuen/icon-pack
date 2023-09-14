import { pick } from "lodash-unified";
import { ProjectRole } from "~/constant";
import { IUser, Project } from "~/server/models";

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  const project = await Project.findById(params!.pid, "users");

  if (!project) {
    return sendNoContent(event, 404);
  }

  const { users } = (await project.populate({
    path: "users.id",
    select: "nid avatar nickname _id",
  })) as {
    users: Array<{
      id: IUser;
      role: ProjectRole;
    }>;
  };

  return {
    code: 0,
    data: users.map((item) => ({
      role: item.role,
      id: (item.id as any)._id,
      ...pick(item.id, ["nid", "nickname", "avatar"]),
    })),
  };
});
