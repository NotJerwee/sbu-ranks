export const getHighestElo = (history: { elo_score: number }[]) =>
	history.reduce((max, entry) => Math.max(max, entry.elo_score), 0);