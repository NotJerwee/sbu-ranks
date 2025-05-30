import { getRecentElo } from "@/utils/getRecentElo";
import { Line } from "react-chartjs-2";
import {
	Chart,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Filler,
} from "chart.js";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

interface Props {
	history: { created_at: string; elo_score: number }[];
}

export default function StatsChart({ history }: Props) {
	const latestPerDay = getRecentElo(history);

	return (
		<Line
		data={{
			labels: latestPerDay.map(h =>
				new Date(h.created_at).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				})
			),
			
			datasets: [{
				label: "ELO Rating",
				data: latestPerDay.map(h => h.elo_score),
				borderColor: "#3b82f6",
				backgroundColor: "rgba(59, 130, 246, 0.2)",
				tension: 0.3,
				fill: true,
				pointRadius: 4,
				pointHoverRadius: 6,
			}],
		}}
		options={{
			responsive: true,
			plugins: {
				legend: { display: false },
				tooltip: {
					enabled: true,
					callbacks: {
						title: () => "",
						label: context => `${context.label}: ${context.parsed.y}`,
					},
				},
			},
			interaction: {
				mode: "index" as const,
				intersect: false,
			},
			scales: {
				x: {
					ticks: { color: "#6b7280" },
				},
				y: {
					ticks: { color: "#6b7280" },
					beginAtZero: false,
				},
			},
		}}
		/>
	);
}
