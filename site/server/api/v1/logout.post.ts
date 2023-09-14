// 注册使用的账号和密码分别为 nid和@1234567
// 如果用户没有注册则自动注册
export default defineEventHandler(async (event) => {
  const session = await useSession(event);
  session && (await session.destroy());
  const cookie = await getCookie(event, 'icon-token');
  setCookie(event, 'icon-token', '', {
    expires: new Date(-100),
    path: '/',
    sameSite: 'none',
  });
  setCookie(event, 'icon-session', '', {
    expires: new Date(-100),
    path: '/',
    sameSite: 'none',
  });
  if (cookie) {
    await useStorage().removeItem(`redis:token:${cookie}`);
  }
  return { code: 0, data: true };
});
