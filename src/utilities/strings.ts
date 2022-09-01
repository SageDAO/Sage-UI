export function reformatDate(date: string | Date | number) {
  const reformatted = new Date(date).toISOString();
// .split('T')[0].replaceAll('-', '.')
  return reformatted;
}
