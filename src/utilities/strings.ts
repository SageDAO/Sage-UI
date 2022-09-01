export function reformatDate(date: string | Date | number) {
  const dateObj = new Date(date);
  const reformatted = dateObj.toISOString();
  // .split('T')[0].replaceAll('-', '.')
  return reformatted;
}
