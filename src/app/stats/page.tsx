"use client";

import { BarChart2, UtensilsCrossed } from "lucide-react";
import Loading from "@/components/Loading";
import OptionCard from "./OptionCard";
import useStatsData from "./useStatsData";

export default function StatsPage() {
	const { foodOptions, loading, expandedId, setExpandedId, eloHistory, fetchHistory } = useStatsData();

	return (
		<main className="max-w-4xl mx-auto py-12 px-4">
			<div className="text-center mb-10">
				<h1 className="text-3xl font-bold text-red-700 flex justify-center items-center gap-2">
					<BarChart2 size={30} /> Campus Rankings
				</h1>
				<h2 className="text-lg text-gray-500 mt-2 flex justify-center items-center gap-2">
					<UtensilsCrossed size={20} />
					Discover Top-Rated Food on Campus
				</h2>
			</div>

			{loading ? (
				<Loading />
			) : (
				<ul className="space-y-4">
					{foodOptions.map((option, index) => (
						<OptionCard
							key={option.id}
							option={option}
							index={index}
							isExpanded={expandedId === option.id}
							onToggle={() => {
								setExpandedId(expandedId === option.id ? null : option.id);
								fetchHistory(option.id);
							}}
							eloHistory={eloHistory[option.id]}
						/>
					))}
				</ul>
			)}
		</main>
	);
}
