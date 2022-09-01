export function reformatDate(date: string | Date | number) {
  return new Date(date).toISOString().split('T')[0].replaceAll('-', '.');
}
