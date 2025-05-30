'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Option {
	id: string;
	name: string;
	elo_score: number;
}

interface OptionCardProps {
	option: Option;
	isSelected: boolean;
	hasVoted: boolean;
	voteCount: number;
	totalVotes: number;
	eloChange?: number;
	onVote: (id: string) => void;
	disabled: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({
	option,
	isSelected,
	hasVoted,
	eloChange,
	onVote,
	disabled,
}) => {
	return (
		<button
			onClick={() => onVote(option.id)}
			disabled={disabled}
			className={`p-6 rounded-lg shadow border text-center transition ${
				hasVoted && isSelected
				? 'bg-green-100 ring-2 ring-green-400'
				: hasVoted || disabled
				? ''
				: 'bg-white hover:shadow-md cursor-pointer'
			}`}
		>
			<h3 className="text-xl font-bold mb-2">{option.name}</h3>
			<div className="text-sm text-gray-600 mt-1 flex items-center justify-center gap-3">
				<span>Score: {option.elo_score}</span>
				{hasVoted && typeof eloChange === 'number' && (
					<span className="flex items-center gap-1">
						{eloChange >= 0 ? (
						<TrendingUp size={14} className="text-green-600" />
						) : (
						<TrendingDown size={14} className="text-red-600" />
						)}
						<span className={eloChange >= 0 ? 'text-green-600' : 'text-red-600'}>
							{eloChange >= 0 ? `+${eloChange}` : `${eloChange}`} pts
						</span>
					</span>
				)}
			</div>
			
			{hasVoted && isSelected && (
				<p className="text-sm text-green-600 mt-2 font-medium">Your Vote</p>
			)}
		</button>
	);
};

export default OptionCard;
