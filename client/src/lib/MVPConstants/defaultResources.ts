import { ResourceID, ResourceType } from "../util/store/roomTypes";

export const MVPResources: { [id: ResourceID]: ResourceType } = {
	0: {
		name: 'Investigator',
		speed: 5,
		asset: 'ASSET_STRING',
	},
	1: {
		name: 'SWAT Van',
		speed: 20,
		asset: 'ASSET_STRING',
	},
	2: {
		name: 'Squad Car',
		speed: 30,
		asset: 'ASSET_STRING',
	},
	3: {
		name: 'Ambulance',
		speed: 20,
		asset: 'ASSET_STRING',
	},
	4: {
		name: 'Fire Truck',
		speed: 10,
		asset: 'ASSET_STRING',
	},
	5: {
		name: 'Bomb Squad',
		speed: 20,
		asset: 'ASSET_STRING',
	},
	6: {
		name: 'Chemical Truck',
		speed: 20,
		asset: 'ASSET_STRING',
	},
};