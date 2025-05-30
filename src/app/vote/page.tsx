"use client";

import { useVoteData } from "@/hooks/useVoteData";
import { vote } from "@/lib/voteLogic";
import OptionCard from "./OptionCard";
import VoteResults from "./VoteResults";
import Loading from "@/components/Loading";
import { Vote } from "lucide-react";
import { getRank } from "@/utils/getRank";

export default function VotePage() {
	const {
		options,
		voteCounts,
		setVoteCounts,
		user,
		hasVoted,
		selected,
		setSelected,
		loading,
		globalRankings,
		setGlobalRankings,
		eloChanges,
		setEloChanges,
		setHasVoted,
		setOptions,
		currentTime,
		nextVoteTime,
	} = useVoteData();

	const handleVote = (winnerId: string) => {
		vote({
			winnerId,
			user,
			options,
			setEloChanges,
			setOptions,
			setGlobalRankings,
			setVoteCounts,
			setHasVoted,
			setSelected,
		});
	};

	return (
		<main className="max-w-4xl mx-auto py-12 px-4">
			<div className="text-center mb-10">
				<h1 className="text-5xl font-bold text-red-700 flex justify-center items-center gap-2">
					<Vote size={32} /> Which Place Is Better?
				</h1>
				<h2 className="text-lg text-gray-500 mt-2">
					Vote today and discover how your choice compares to others on campus
				</h2>
			</div>

			<div className="text-center text-gray-600 mb-6">
				{!user ? (
					<>
						<p className="mb-2">You must be signed in to vote.</p>
						<p>
							Current time: <strong>{currentTime}</strong>
						</p>
						<p>
							Next vote in: <strong>{nextVoteTime}</strong>
						</p>
					</>
				) : hasVoted ? (
					<>
						<p className="mb-2">You&rsquo;ve already voted today!</p>
						<p>
							Current time: <strong>{currentTime}</strong>
						</p>
						<p>
							Next vote in: <strong>{nextVoteTime}</strong>
						</p>
					</>
				) : (
					<>
						<p className="mb-2">Cast your vote below!</p>
						<p>
							Current time: <strong>{currentTime}</strong>
						</p>
						<p>
							Voting ends in: <strong>{nextVoteTime}</strong>
						</p>
					</>
				)}
			</div>

			{loading ? (
				<Loading />
			) : (
				<>
					{/* Option buttons for users to decide */}
					<div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 sm:gap-6">
						{options.map((opt) => {
							const isSelected = selected === opt.id;
							const voteCount = voteCounts[opt.id] ?? 0;
							const totalVotes = options.reduce((sum, o) => sum + (voteCounts[o.id] ?? 0), 0);
							const eloChange = eloChanges[opt.id];
							const disabled = user === null || hasVoted;

							return (
								<OptionCard
									key={opt.id}
									option={opt}
									isSelected={isSelected}
									hasVoted={hasVoted}
									voteCount={voteCount}
									totalVotes={totalVotes}
									eloChange={eloChange}
									onVote={handleVote}
									disabled={disabled}
								/>
							);
						})}
					</div>

					{/* Results Section after user has voted */}
					{user && hasVoted && (
						<VoteResults
							options={options}
							selected={selected}
							voteCounts={voteCounts}
							globalRankings={globalRankings}
							eloChanges={eloChanges}
							getRank={getRank}
						/>
					)}
				</>
			)}
		</main>
	);
}
