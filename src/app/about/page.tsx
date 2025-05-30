"use client";

export default function AboutPage() {
	return (
		<main className="max-w-3xl mx-auto px-6 py-12">
			<h1 className="text-5xl font-bold mb-10 text-center text-red-700">About SBU Ranks</h1>

			<div className="bg-white border border-gray-200 rounded-lg shadow p-6 mb-6">
				<h2 className="text-2xl font-semibold mb-3 text-gray-800">What is SBU Ranks?</h2>
				<p className="text-lg text-gray-700 leading-relaxed">
					SBU Ranks is a student-driven platform where you can vote daily on the best experiences across Stony Brook University.
				</p>
			</div>

			<div className="bg-white border border-gray-200 rounded-lg shadow p-6 mb-6">
				<h2 className="text-2xl font-semibold mb-3 text-gray-800">Our Mission</h2>
				<p className="text-lg text-gray-700 leading-relaxed">
					Our goal is to give students a voice in highlighting what they love most about campus &mdash; whether it&rsquo;s the best food, top study spaces, or hidden gems.
				</p>
			</div>

			<div className="bg-white border border-gray-200 rounded-lg shadow p-6">
				<h2 className="text-2xl font-semibold mb-3 text-gray-800">How the ELO Ranking Works</h2>
				<p className="text-lg text-gray-700 leading-relaxed mb-4">
					Our system uses the ELO rating system &mdash; the same method used in chess.com to rank players. Every place starts with a score of 1200, and rankings adjust with each vote:
				</p>
				<ul className="list-disc list-inside text-lg text-gray-700 space-y-2 pl-2">
					<li>The winner gains points, while the loser loses points.</li>
					<li>The amount exchanged depends on how strong the opponent is.</li>
					<li>Beating a higher-rated place earns more points.</li>
					<li>Beating a lower-rated place earns fewer points.</li>
				</ul>
				<p className="text-lg text-gray-700 leading-relaxed mt-4">
					This ensures rankings stay fair, competitive, and reflective of what the campus community actually prefers &mdash; one vote at a time.
				</p>
			</div>
		</main>
	);
}
