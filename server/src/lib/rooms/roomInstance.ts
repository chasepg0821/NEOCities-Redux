import { forEach } from "lodash";
import { GameInstance } from "./gameInstance";
import { RoleID, RoomDataType, LobbyDataType, RoomSetupType, UserID, UserType, RoomInfoType, UserState, RoomStateEnum, RoleType, TaskID, TaskType } from "./roomTypes";
import { AppServerType, getSocketServer } from "../sockets";

export class RoomInstance {
    private io: AppServerType = getSocketServer();
    private roomData: RoomDataType;
    private game: GameInstance | undefined;
    
    constructor (roomData: RoomDataType) {
        this.roomData = roomData
    }

    public getID(): string {
        return this.roomData.id;
    }

    public getRoomState(): RoomStateEnum {
        return this.roomData.state;
    }

    public getAdmin(): { id: UserID, name: string } {
        return this.roomData.admin;
    }

    public getGameDuration(): number {
        return this.roomData.roomSetup.time;
    }

    public addUser(id: UserID, user: UserType): void {
        this.roomData.users[id] = user;
    }

    public removeUser(id: UserID): void {
        // remove them from any roles they were assigned to
        forEach(this.getRoleAssignments(), (u, r) => {
            if (u === id) {
                this.setRoleAssignment(parseInt(r), "");
                this.io.in(this.getID()).emit("assignedRole", parseInt(r), "");
            }
        });
        delete this.roomData.users[id]
        this.io.in(this.getID()).emit("userLeft", id);
    }

    public getUsers(): {[id: UserID]: UserType } {
        return this.roomData.users;
    }

    public getUserState(id: UserID): UserState | undefined {
        return this.roomData.users[id].state;
    }

    public setUserState(id: UserID, state: UserState): void {
        this.roomData.users[id].state = state;
    }

    public getRoles(): { [id: RoleID]: RoleType } {
        return this.roomData.roomSetup.roles;
    }

    public getRoleAssignments(): { [id: RoleID]: UserID } {
        return this.roomData.roomSetup.roleAssignments;
    }

    private setRoleAssignment(role: RoleID, user: UserID): void {
        this.roomData.roomSetup.roleAssignments[role] = user;
    }

    public assignRole(role: RoleID, user: UserID): void {
        forEach(this.getRoleAssignments(), (u, r) => {
            if (parseInt(r) === role) {
                this.setRoleAssignment(parseInt(r), u);
            } else if (u === user) {
                this.setRoleAssignment(parseInt(r), "");
            }
        });

        this.io.in(this.getID()).emit("assignedRole", role, user);
    }

    public getRoomInfo(): RoomInfoType {
        return {
            id: this.getID(),
            admin: this.getAdmin(),
            numUsers: Object.keys(this.getUsers()).length,
        }
    }

    public getLobbyData(): LobbyDataType {
        const roles: { [id: RoleID]: { name: string, color: string }} = {};
        forEach(this.roomData.roomSetup.roles, (role, rid) => {
            roles[parseInt(rid)] = {
                name: role.name,
                color: role.color
            }
        })

        return {
            id: this.roomData.id,
            admin: this.getAdmin(),
            users: this.getUsers(),
            roles,
            roleAssignments: this.roomData.roomSetup.roleAssignments
        }
    }

    public getSetup(): RoomSetupType {
        return this.roomData.roomSetup;
    }

    public getTask(id: TaskID): TaskType {
        return this.roomData.roomSetup.tasks[id];
    }

    public stageGame(): void {
        this.game = new GameInstance(this);
        this.io.in(this.getID()).emit("stagedGame", this.getID());
    }

    public getGame(): GameInstance | undefined {
        return this.game;
    }
}