export const objectKeysOfContract: string[] = [
	"number",
	"addedBy",
	"createdAt",
	"invoice.number",
	"invoice.date",
	"invoice.totalCost",
	"invoice.buyer.name",
	"CUI/CNP",
];

export const setFrontendKeysAsBackend = (key: string): string => {
	switch (key) {
		case "contractNumber":
			return "number";
		case "invoiceNumber":
			return "invoice.number";
		default:
			return key;
	}
};
