import * as crypto from 'crypto';

export const getFingerPrint = (content: string) =>
  crypto.createHash('sha256').update(content).digest('hex');
