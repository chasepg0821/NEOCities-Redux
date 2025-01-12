import { forEach } from "lodash";
import { GameInstance } from "./gameInstance";
import { RoleID, RoomDataType, LobbyDataType, RoomSetupType, TaskID, TaskType, UserID, UserType, RoomInfoType, UserState } from "./roomTypes";

export class RoomInstance {
    private roomData: RoomDataType;
    private game: GameInstance | undefined;
    
    constructor (roomData: RoomDataType) {
        this.roomData = roomData
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

    public getID(): string {
        return this.roomData.id;
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

    public getRoleAssignments(): { [id: RoleID]: UserID } {
        return this.roomData.roomSetup.roleAssignments;
    }

    public assignRole(role: RoleID, user: UserID): void {
        forEach(this.roomData.roomSetup.roleAssignments, (u, r) => {
            if (parseInt(r) === role) {
                this.roomData.roomSetup.roleAssignments[parseInt(r)] = user
            } else if (u === user) {
                this.roomData.roomSetup.roleAssignments[parseInt(r)] = ""
            }
        });
    }

    public hasStarted(): boolean {
        return this.game ? true : false;
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