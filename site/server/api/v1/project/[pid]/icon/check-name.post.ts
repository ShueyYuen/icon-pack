import { Icon } from "~/server/models";

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event);
  const { params } = event.context;
  const icon = await Icon.findOne({
    project: params!.pid,
    class: name,
  });
  return icon ? { code: 10001, msg: "图标名称已经存在" } : { code: 0 };
});
