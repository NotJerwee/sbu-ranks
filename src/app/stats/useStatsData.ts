import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Option } from "@/types";
import { TABLES } from "@/constants/tables";

interface EloHistoryEntry {
	created_at: string;
	elo_score: number;
}

export default function useStatsData() {
	const [foodOptions, setFoodOptions] = useState<Option[]>([]);
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [eloHistory, setEloHistory] = useState<Record<string, EloHistoryEntry[]>>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFoodOptions = async () => {
		const { data, error } = await supabase
			.from(TABLES.OPTIONS)
			.select("id, name, elo_score")
			.order("elo_score", { ascending: false });

		if (error) console.error("Error fetching food options:", error);
		else setFoodOptions(data);

		setLoading(false);
		};

		fetchFoodOptions();
	}, []);

	const fetchHistory = async (optionId: string) => {
		if (!eloHistory[optionId]) {
			const { data, error } = await supabase
				.from(TABLES.HISTORY)
				.select("created_at, elo_score")
				.eq("option_id", optionId)
				.order("created_at");

			if (!error && data) {
				setEloHistory((prev) => ({ ...prev, [optionId]: data }));
			}
		}
	};

	return { foodOptions, loading, expandedId, setExpandedId, eloHistory, fetchHistory };
}
