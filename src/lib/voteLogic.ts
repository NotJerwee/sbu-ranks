import { supabase } from "@/lib/supabase";
import { getEasternDate } from "@/utils/getEasternDate";
import { Option } from "@/types";
import { TABLES } from "@/constants/tables";

interface VoteParams {
	winnerId: string;
	user: string | null | undefined;
	options: Option[];
	setEloChanges: (value: Record<string, number>) => void;
	setOptions: (value: Option[]) => void;
	setGlobalRankings: (value: Option[]) => void;
	setVoteCounts: (value: Record<string, number>) => void;
	setHasVoted: (value: boolean) => void;
	setSelected: (value: string) => void;
}

export async function vote({
	winnerId,
	user,
	options,
	setEloChanges,
	setOptions,
	setGlobalRankings,
	setVoteCounts,
	setHasVoted,
	setSelected,
}: VoteParams) {
	if (!user || options.length < 2) return;

	setHasVoted(true);
	setSelected(winnerId);

	const [a, b] = options;
	const winner = winnerId === a.id ? a : b;
	const loser = winnerId === a.id ? b : a;

	const expectedScore = (ra: number, rb: number) => 1 / (1 + Math.pow(10, (rb - ra) / 400));
	const K = 32;
	const Ea = expectedScore(winner.elo_score, loser.elo_score);
	const Eb = expectedScore(loser.elo_score, winner.elo_score);
	const newWinnerScore = Math.round(winner.elo_score + K * (1 - Ea));
	const newLoserScore = Math.round(loser.elo_score + K * (0 - Eb));

	const winnerChange = newWinnerScore - winner.elo_score;
	const loserChange = newLoserScore - loser.elo_score;

	setEloChanges({
		[winner.id]: winnerChange,
		[loser.id]: loserChange,
	});

	await supabase.from(TABLES.OPTIONS).update({ elo_score: newWinnerScore }).eq("id", winner.id);
	await supabase.from(TABLES.OPTIONS).update({ elo_score: newLoserScore }).eq("id", loser.id);

	const today = getEasternDate();
	localStorage.setItem(`vote_${user}_${today}`, winnerId);

	const { data: matchup, error: matchupErr } = await supabase
		.from(TABLES.MATCHUPS)
		.select("id, vote_counts")
		.eq("date", today)
		.single();

	if (matchupErr || !matchup) {
		console.error("Failed to fetch matchup for vote count:", matchupErr);
		return;
	}

	const updatedVoteCounts = { ...(matchup.vote_counts || {}) };
	updatedVoteCounts[winner.id] = (updatedVoteCounts[winner.id] ?? 0) + 1;

	await supabase.from(TABLES.HISTORY).insert([
		{ option_id: winner.id, date: today, elo_score: newWinnerScore },
		{ option_id: loser.id, date: today, elo_score: newLoserScore },
	]);

	const { data: updatedOptions } = await supabase
		.from(TABLES.OPTIONS)
		.select("id, name, elo_score")
		.in("id", [a.id, b.id]);

	const { data: updatedRankings } = await supabase
		.from(TABLES.OPTIONS)
		.select("id, name, elo_score")
		.order("elo_score", { ascending: false });

	await supabase
		.from(TABLES.MATCHUPS)
		.update({
		vote_counts: updatedVoteCounts,
		elo_changes: {
			[winner.id]: winnerChange,
			[loser.id]: loserChange,
		},
		})
		.eq("id", matchup.id);

	setOptions(updatedOptions ?? []);
	setGlobalRankings(updatedRankings ?? []);
	setVoteCounts(updatedVoteCounts); 
}
