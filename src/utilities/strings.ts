export function reformatDate(date: Date) {
  return new Date(date).toISOString().split('T')[0].replaceAll('-', '.');
}
