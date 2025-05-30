export interface EloEntry {
	created_at: string;
	elo_score: number;
}

export function getRecentElo(history: EloEntry[]) {
	if (history.length === 0) return [];

	const map = new Map<string, EloEntry>();
	for (const entry of history) {
		const day = new Date(entry.created_at).toISOString().split("T")[0];
		if (!map.has(day) || new Date(entry.created_at) > new Date(map.get(day)!.created_at)) {
			map.set(day, entry);
		}
	}

	const daysSorted = Array.from(map.keys()).sort();
	const filledHistory: EloEntry[] = [];

	const currentDate = new Date(daysSorted[0]);
	const lastDate = new Date(daysSorted[daysSorted.length - 1]);
	let lastElo = map.get(daysSorted[0])!.elo_score;

	while (currentDate <= lastDate) {
		const isoDay = currentDate.toISOString().split("T")[0];

		if (map.has(isoDay)) {
			lastElo = map.get(isoDay)!.elo_score;
			filledHistory.push(map.get(isoDay)!);
		} else {
			filledHistory.push({
				created_at: isoDay + "T00:00:00Z",
				elo_score: lastElo,
			});
		}

		currentDate.setDate(currentDate.getDate() + 1);
	}

	return filledHistory;
}