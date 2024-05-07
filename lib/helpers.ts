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
