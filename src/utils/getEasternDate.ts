export const getEasternDate = (): string => {
	const formatter = new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	const parts = formatter.formatToParts(new Date());
	const dateObj: Record<string, string> = {};
	for (const part of parts) {
		if (part.type !== "literal") {
			dateObj[part.type] = part.value;
		}
	}

	return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
};
