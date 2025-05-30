export const getMedalColor = (index: number) => {
	if (index === 0) return "bg-yellow-400 text-white";
	if (index === 1) return "bg-gray-400 text-white";
	if (index === 2) return "bg-orange-800 text-white";
	return "bg-gray-100 text-gray-800";
};
 