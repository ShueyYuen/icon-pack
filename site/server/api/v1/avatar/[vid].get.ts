import { Avatar } from '~/server/models';

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  const avatarId = params!.vid.split('.')[0];
  const avatar = await Avatar.findById(avatarId, 'src');
  if (!avatar) {
    return sendNoContent(event, 404);
  }
  const buffer = Buffer.from(avatar.src, 'base64');
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
  setResponseHeader(event, 'Content-Type', 'image/jpeg');
  setResponseHeader(event, 'Content-Length', buffer.length);
  setResponseHeader(event, 'Content-Security', "default-src 'none'");
  setResponseHeader(event, 'Content-Transfer-Encoding', 'binary');
  setResponseHeader(
    event,
    'Content-Disposition',
    `inline; filename="${avatarId}.jpeg"; filename*=utf-8''${avatarId}.jpeg`
  );
  return buffer;
});
