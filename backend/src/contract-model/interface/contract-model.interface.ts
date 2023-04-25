export interface IContractModel {
	name: string;
	content: string;
	addedBy?: string;
	editedBy?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IContractModelResponse {
	models: IContractModel[];
	model: IContractModel;
}

export interface IContractModelPdfContent {
	title: string;
	content: string;
}