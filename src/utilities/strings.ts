export function reformatDate(date: Date) {
  return new Date(date).toISOString().split('T')[0].replaceAll('-', '.');
}

// usage: standard string manipulation through entire site for 1) drop names 2) nft names 3) game names, 4) artist names throughout app
export function transformTitle(title: string) {
  return title.charAt(0).toUpperCase() + title.slice(1);
}
