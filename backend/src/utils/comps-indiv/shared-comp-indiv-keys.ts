export const getObjectKeys = (documentType: string): string[] => {
	const keys = [
		"name",
		"headquarters",
		"bankAccount",
		"bank",
		"email",
		"phone",
		"isActivated",
		"addedBy",
		"editedBy",
		"totalSum",
		"totalPayment",
	];
	switch (documentType) {
		case "company":
			keys.splice(keys.length, 0, "J", "CUI", "vatRate");
			break;
		case "individual":
			keys.splice(keys.length, 0, "series", "CNP");
			break;
		default:
			break;
	}
	return keys;
};
