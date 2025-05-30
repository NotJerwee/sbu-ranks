"use client";

import { useEffect, useState } from "react";
import { getEasternDate } from "@/utils/getEasternDate";
import { Option } from "@/types";
import { TABLES } from "@/constants/tables";
import { supabase } from "@/lib/supabase";


export const useVoteData = () => {
	const [options, setOptions] = useState<Option[]>([]);
	const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
	const [hasVoted, setHasVoted] = useState(false);
	const [selected, setSelected] = useState<string | null>(null);
	const [nextVoteTime, setNextVoteTime] = useState<string>('');
	const [user, setUser] = useState<string | null | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const [currentTime, setCurrentTime] = useState<string>('');
	const [globalRankings, setGlobalRankings] = useState<Option[]>([]);
	const [eloChanges, setEloChanges] = useState<Record<string, number>>({});

	// Runs once on mount: fetches or initializes today’s matchup and vote state
	useEffect(() => {
		// Get the current user session
		const init = async () => {
			const {data: { session } } = await supabase.auth.getSession();
			const userId = session?.user?.id ?? null;
			setUser(userId);

			const today = getEasternDate();

			// Check if this user has already voted today
			const voteKey = userId ? `vote_${userId}_${today}` : null;
			const alreadyVoted = voteKey ? localStorage.getItem(voteKey) : null;
			if (alreadyVoted) {
				setHasVoted(true);
				setSelected(alreadyVoted);
			}

			// Calculate time until midnight (EST) for countdown display
			const now = new Date();
			const tomorrow = new Date();
			tomorrow.setHours(24, 0, 0, 0);
			const diff = tomorrow.getTime() - now.getTime();
			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			setNextVoteTime(`${hours}h ${minutes}m`);

			// Fetch today’s matchup from Supabase
			const { data: matchData, error: matchError } = await supabase
				.from(TABLES.MATCHUPS)
				.select("id, options, vote_counts")
				.eq("date", today)
				.single();

			if (matchError && matchError.code !== "PGRST116") {
				console.error("Error checking matchups:", matchError);
				setLoading(false);
				return;
			}

			// If no matchup exists yet — randomly pick 2 options and create one
			if (!matchData) {
				const { data: allOptions, error: fetchError } = await supabase
					.from(TABLES.OPTIONS)
					.select("id, name, elo_score");

				if (fetchError) {
					console.error("Error fetching all food options:", fetchError);
					setLoading(false);
					return;
				}

				const shuffled = allOptions.sort(() => 0.5 - Math.random());
				const dailyOptions = shuffled.slice(0, 2);
				const insertedIds = dailyOptions.map((o) => o.id);

				const { error: insertError } = await supabase
					.from(TABLES.MATCHUPS)
					.insert([{
						date: today,
						options: insertedIds,
						vote_counts: {
						[insertedIds[0]]: 0,
						[insertedIds[1]]: 0,
						},
					}]);

				if (insertError) {
					console.error("Error inserting new matchup:", insertError);
					setLoading(false);
					return;
				}

				setOptions(dailyOptions);
				setVoteCounts({ [insertedIds[0]]: 0, [insertedIds[1]]: 0 });
			} else {
				// Match already exists, load its options
				const { data: optionsData, error: optionsError } = await supabase
					.from(TABLES.OPTIONS)
					.select("id, name, elo_score")
					.in("id", matchData.options);

				if (optionsError) {
					console.error("Error loading today's matchup options:", optionsError);
					setLoading(false);
					return;
				}

				setOptions(optionsData);
				setVoteCounts(matchData.vote_counts ?? {});
			}

			// Fetch the full global rankings list (used for post-vote stats)
			const { data: allRanked, error: rankError } = await supabase
				.from(TABLES.OPTIONS)
				.select("id, name, elo_score")
				.order("elo_score", { ascending: false });

			if (rankError) {
				console.error("Error fetching global rankings:", rankError);
			} else {
				setGlobalRankings(allRanked);
			}

			setLoading(false);
		};

		init();
	}, []);

	// Update the live clock every second
	useEffect(() => {
		const updateClock = () => {
		const now = new Date();
		setCurrentTime(now.toLocaleTimeString());
		};

		updateClock();
		const interval = setInterval(updateClock, 1000);
		return () => clearInterval(interval);
	}, []);

	// Refresh voteCounts and eloChanges after someone else votes
	useEffect(() => {
		const fetchMatchup = async () => {
		const today = getEasternDate();
		const { data, error } = await supabase
			.from(TABLES.MATCHUPS)
			.select("options, vote_counts, elo_changes")
			.eq("date", today)
			.single();

		if (error || !data) return;

		setVoteCounts(data.vote_counts || {});
		setEloChanges(data.elo_changes || {});
		};

		fetchMatchup();
	}, []);

	return {
		options,
		setOptions,
		voteCounts,
		setVoteCounts,
		hasVoted,
		setHasVoted,
		selected,
		setSelected,
		nextVoteTime,
		user,
		loading,
		currentTime,
		globalRankings,
		setGlobalRankings,
		eloChanges,
		setEloChanges,
	};
};
