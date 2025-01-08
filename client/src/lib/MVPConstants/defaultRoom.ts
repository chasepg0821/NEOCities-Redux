import { RoomSetupType } from "../util/store/roomTypes";
import { MVPResources } from "./defaultResources";
import { MVPRoleAssignments, MVPRoles } from "./defaultRoles";
import { MVPTasks } from "./defaultTasks";

export const MVPRoom: RoomSetupType = {
    time: 600,
    roleAssignments: MVPRoleAssignments,
    roles: MVPRoles,
    resources: MVPResources,
    tasks: MVPTasks
}