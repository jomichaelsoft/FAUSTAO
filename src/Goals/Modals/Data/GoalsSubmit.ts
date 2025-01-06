import { IModalData } from "../../../Core/Modals/Types/ModalData";
import { Handle } from "../Handlers/GoalsSubmit";

interface IInputCustomIds {
	objectives: string;
	inspirations: string;
}

export const MODAL_DATA: IModalData<IInputCustomIds> = {
	customId: "GoalsModal",

	inputCustomIds: {
		objectives: "GoalsModalObjectives",
		inspirations: "GoalsModalInspirations",
	},

	handler: Handle,
};
