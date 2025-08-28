//NOTE: app reference Generator

export function generateAppReference(): string {
  const prefix = 'FB';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${prefix}-${timestamp}-${random}`;
}
