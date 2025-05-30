import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { getMedalColor } from "@/utils/getMedalColor";
import { getHighestElo } from "@/utils/getHighestElo";
import StatsChart from "./StatsChart";

interface Props {
	option: { id: string; name: string; elo_score: number };
	index: number;
	isExpanded: boolean;
	onToggle: () => void;
	eloHistory?: { created_at: string; elo_score: number }[];
}

export default function OptionCard({ option, index, isExpanded, onToggle, eloHistory = [] }: Props) {
	return (
		<li className="bg-white border border-gray-200 rounded-lg shadow p-4">
		<button onClick={onToggle} className="w-full flex justify-between items-center cursor-pointer">
			<div className="flex items-center gap-3">
				<div className={`px-3 py-1 rounded-full text-sm font-semibold ${getMedalColor(index)}`}>
					#{index + 1}
				</div>
				<span className="font-medium text-gray-800">{option.name}</span>
			</div>
				<div className="flex items-center gap-2 font-semibold">
				<Trophy size={18} />
				{Math.round(option.elo_score)}
				{isExpanded ? <ChevronUp /> : <ChevronDown />}
			</div>
		</button>

		{isExpanded && (
			<div className="mt-6 px-2">
				{history.length > 0 ? (
					<>
						<div className="text-sm text-gray-700 mb-2">
							Highest Rating: <strong>{getHighestElo(eloHistory)}</strong>
						</div>
						<StatsChart history={eloHistory} />
					</>
				) : (
					<p className="text-sm text-gray-500">No ELO history available.</p>
				)}
			</div>
		)}
		</li>
	);
}
