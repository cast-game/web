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

export const getTimeSince = (unix: string): string => {
	const seconds = Math.floor((Date.now() - Number(unix)) / 1000);
	const intervals = [
		{ seconds: 31536000, label: "y" },
		{ seconds: 2592000, label: "mo" },
		{ seconds: 86400, label: "d" },
		{ seconds: 3600, label: "h" },
		{ seconds: 60, label: "m" },
	];

	for (let { seconds: intervalSeconds, label } of intervals) {
		const interval = Math.floor(seconds / intervalSeconds);
		if (interval >= 1) return `${interval}${label}`;
	}

	return "just now";
};
