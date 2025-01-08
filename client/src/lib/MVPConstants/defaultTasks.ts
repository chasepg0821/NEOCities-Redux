import { TaskID, TaskType } from "../util/store/roomTypes";

export const MVPTasks: { [id: TaskID]: TaskType } = {
	1: {
		name: 'Chemical Spill',
		start: 10,
		duration: 30,
		location: {
			x: 10,
			y: 10,
		},
		resources: [[0, 6]]
	}
};