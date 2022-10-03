export function reformatDate(date: Date) {
  return new Date(date).toISOString().split('T')[0].replaceAll('-', '.');
}

// usage: standard string manipulation through entire site for 1) drop names 2) nft names 3) game names, 4) artist names throughout app
export function transformTitle(title: string) {
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/**
 * Formats a timestamp to a MM/dd HH:mm string
 */
 export function formatTimestampMMddHHmm(ts: number) {
  return formatDateMMddHHmm(new Date(ts * 1000));
}

export function formatDateMMddHHmm(date: Date) {
  const padTo2Digits = (v: number) => v.toString().padStart(2, '0');
  const d = new Date(date);
  return (
    `${padTo2Digits(d.getMonth() + 1)}/${padTo2Digits(d.getDate())} ` +
    `${padTo2Digits(d.getHours())}:${padTo2Digits(d.getMinutes())}`
  );
}