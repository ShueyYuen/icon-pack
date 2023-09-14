import crypto from "crypto";

const SECRET_KEY = "P@ssw0rd";

export const md5 = (content: string): string => {
  const md5 = crypto.createHash("md5");
  return md5.update(content).digest("hex");
};

export const genPassword = (
  password: string,
  salt: string = SECRET_KEY
): string => {
  return md5(`pw:${password}&salt:${salt}`);
};
