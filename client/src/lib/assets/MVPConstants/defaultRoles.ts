import { RoleID, RoleType, UserID } from "../util/store/roomTypes";

export enum RoleEnum { // static, eventually will come from relational db
    Observer,
	Hazmat,
	Fire,
	Police,
}
export const MVPRoles: { [id: RoleID]: RoleType } = {
	[RoleEnum.Hazmat]: {
		name: 'Hazmat',
		color: 'hsl(50.6, 100%, 50%)',
		resources: [0, 5, 6],
		base: {
			x: 0,
			y: 0
		}
	},
	[RoleEnum.Fire]: {
		name: 'Fire',
		color: 'hsl(348, 96%, 42%)',
		resources: [0, 3, 4],
		base: {
			x: 0,
			y: 0
		}
	},
	[RoleEnum.Police]: {
		name: 'Police',
		color: 'hsl(240, 98%, 24%)',
		resources: [0, 1, 2],
		base: {
			x: 0,
			y: 0
		}
	}
};

export const MVPRoleAssignments: { [id: RoleID]: UserID} = {
    [RoleEnum.Hazmat]: '',
    [RoleEnum.Fire]: '',
    [RoleEnum.Police]: '',
};