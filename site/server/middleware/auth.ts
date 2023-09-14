import jwt from "jsonwebtoken";
import { isString } from "lodash-unified";

import { SECRET_KEY } from "~/constant";
import { useSession } from "~/server/utils/session";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const session = await useSession(event);
  if (!session.user) {
    const token = getCookie(event, "icon-token");
    const auth = await useStorage().getItem(`redis:token:${token}`);
    if (isString(auth)) {
      session.user = event.context.auth = jwt.verify(auth, SECRET_KEY);
      await session.save();
    }
  }

  if (
    !session.user &&
    ![
      "/api/v1/login",
      "/login",
      "/api/v1/meta-filter",
      "/api/v1/project/migrate",
    ].includes(url.pathname)
  ) {
    if (url.pathname.startsWith("/api")) {
      return sendNoContent(event, 403);
    } else {
      sendRedirect(
        event,
        `/login?from=${encodeURIComponent(url.pathname + url.search)}`
      );
    }
  } else if (session.user && url.pathname === "/login") {
    sendRedirect(event, "/");
  }
});
