export function formatTimeRemaining(unixTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000); // Current Unix timestamp
  const difference = unixTimestamp - now;

  if (difference <= 0) {
    return "-";
  }

  const hours = Math.floor(difference / 3600);
  const minutes = Math.floor((difference % 3600) / 60);
  const seconds = difference % 60;

  return `${hours}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

export function getTimeSince(date: string) {
  const _date = new Date(date);
  var seconds = Math.floor((Number(new Date()) - Number(_date)) / 1000);
  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + "y";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + "mo";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + "d";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + "h";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + "m";
  }
  return Math.floor(seconds) + "s";
}