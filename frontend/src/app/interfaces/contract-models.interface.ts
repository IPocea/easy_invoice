export interface IContractModel {
  _id?: string;
  name: string;
  content: string;
  addedBy?: string;
  editedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IContractModelResponse {
	models: IContractModel[];
	model: IContractModel;
}
