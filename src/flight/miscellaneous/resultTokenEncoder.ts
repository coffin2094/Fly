//NOTE: resultTokenEncoder
export function encodeToken(token: string): string {
  return Buffer.from(token).toString('base64');
}

//NOTE: resultDecoder
export function decodeToken(token: string): string {
  return Buffer.from(token, 'base64').toString();
}
