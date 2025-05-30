'use client';

import React from 'react';
import { Users } from 'lucide-react';

interface Option {
	id: string;
	name: string;
	elo_score: number;
}

interface VoteResultsProps {
	options: Option[];
	selected: string | null;
	voteCounts: Record<string, number>;
	globalRankings: Option[];
	eloChanges: Record<string, number>;
	getRank: (id: string, rankings: Option[]) => number | null;
}

const VoteResults: React.FC<VoteResultsProps> = ({
	options,
	voteCounts,
	eloChanges,
	selected,
	getRank,
	globalRankings,
}) => {
	const totalVotes = options.reduce((sum, o) => sum + (voteCounts[o.id] ?? 0), 0);
	const selectedOption = options.find((o) => o.id === selected);
	const otherOptions = options.filter((o) => o.id !== selected);
	
	return (
		<div className="mt-12 border-t pt-8">
		<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
			<Users className="w-5 h-5" /> Results
		</h3>

		<div className="space-y-4">
			{options.map((opt) => {
			const votes = voteCounts[opt.id] ?? 0;
			const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

			return (
				<div key={opt.id}>
					<div className="flex justify-between text-sm text-gray-700">
						<span>{opt.name}</span>
						<span className="flex items-center gap-1">
							<Users size={14} className="text-gray-500" />
							{votes} votes — {percent}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mt-1">
						<div
						className="h-full bg-black transition-all"
						style={{ width: `${percent}%` }}
						/>
					</div>
				</div>
			);
			})}
		</div>

		<p className="text-xs text-gray-500 text-center mt-4">
			Based on historical data and your vote
		</p>

		{/* Winner (Your Choice) */}
		{selectedOption && (
			<div className="mt-8">
				<h4 className="font-semibold mb-2">Your Choice</h4>
				<div className="bg-green-50 border border-green-300 p-4 rounded-lg shadow-sm">
					<h5 className="font-bold text-lg">{selectedOption.name}</h5>
					<div className="text-sm text-gray-600 mt-1">
						{getRank(selectedOption.id, globalRankings) !== null
							? `Rank #${getRank(selectedOption.id, globalRankings)}`
							: 'Unranked'}
					</div>
					<div className="text-sm text-gray-600 mt-1 flex gap-3">
						<span>ELO Rating: {selectedOption.elo_score}</span>
						{typeof eloChanges[selectedOption.id] === 'number' && (
							<span className="flex items-center gap-1 text-green-600">
								+{eloChanges[selectedOption.id]} pts
							</span>
						)}
					</div>
					<div className="text-sm text-gray-600">
					Total Votes: {voteCounts[selectedOption.id] ?? 0}
					</div>
				</div>
			</div>
		)}

		{/* Loser (Other Options) */}
		{otherOptions.length > 0 && (
			<div className="mt-6">
			<h4 className="font-semibold mb-2">Other Options</h4>
			{otherOptions.map((opt) => {
				const optChange = eloChanges[opt.id];
				return (
					<div key={opt.id} className="bg-white border p-4 rounded-lg shadow-sm">
						<h5 className="font-bold text-lg">{opt.name}</h5>
						<div className="text-sm text-gray-600 mt-1">
							{getRank(opt.id, globalRankings) !== null
								? `Rank #${getRank(opt.id, globalRankings)}`
								: 'Unranked'}
						</div>
						<div className="text-sm text-gray-600 mt-1 flex gap-3">
							<span>ELO Rating: {opt.elo_score}</span>
							{typeof optChange === 'number' && (
								<span className="flex items-center gap-1 text-red-600">
								{optChange} pts
								</span>
							)}
						</div>
						<div className="text-sm text-gray-600">
							Total Votes: {voteCounts[opt.id] ?? 0}
						</div>
					</div>
				);
			})}
			</div>
		)}
		</div>
	);
};

export default VoteResults;
