import { getIronSession } from "iron-session";
import { SECRET_KEY } from "~/constant";

export async function useSession(event: import('h3').H3Event) {
  if (event.context.session) {
    return event.context.session;
  }
  const session = await getIronSession(event.req, event.res, {
    cookieName: 'iron-session',
    password: SECRET_KEY.repeat(10),
    ttl: 60 * 60 * 24 * 7,
    cookieOptions: {
      sameSite: 'none',
    },
  });
  event.context.session = session;
  return session;
}
