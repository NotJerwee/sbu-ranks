import { Option } from "@/types";

export function getRank(optionId: string, rankings: Option[]): number | null {
	const index = rankings.findIndex(o => o.id === optionId);
	return index !== -1 ? index + 1 : null;
}
