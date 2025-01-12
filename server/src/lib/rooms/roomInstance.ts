import { forEach } from "lodash";
import { GameInstance } from "./gameInstance";
import { RoleID, RoomDataType, LobbyDataType, RoomSetupType, UserID, UserType, RoomInfoType, UserState, RoomStateEnum, RoleType } from "./roomTypes";

export class RoomInstance {
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

    public addUser(id: UserID, user: UserType): void {
        this.roomData.users[id] = user;
    }

    public removeUser(id: UserID): void {
        delete this.roomData.users[id]
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

    public getAdmin(): { id: UserID, name: string } {
        return this.roomData.admin;
    }

    public getRoles(): { [id: RoleID]: RoleType } {
        return this.roomData.roomSetup.roles;
    }

    public getRoleAssignments(): { [id: RoleID]: UserID } {
        return this.roomData.roomSetup.roleAssignments;
    }

    public setRoleAssignment(role: RoleID, user: UserID): void {
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

    public setSetup(roomSetup: RoomSetupType): void {
        this.roomData.roomSetup = roomSetup;
    }

    public stageGame(): void {
        this.game = new GameInstance(
                this.roomData.roomSetup,
                () => {
                    console.log("Game staged.");
                },
                () => {
                    console.log("Game started.");
                },
                () => {
                    console.log("Game ended.");
                }
            );
    }

    public getGame(): GameInstance | undefined {
        return this.game;
    }
}