import { forEach } from "lodash";
import { GameInstance } from "./gameInstance";
import { RoleID, RoomDataType, RoomLobbyData, RoomSetupType, TaskID, TaskType, UserID, UserType } from "./roomTypes";

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

    public getAdmin(): string {
        return this.roomData.admin;
    }

    public getID(): string {
        return this.roomData.id;
    }

    public getLobbyData(): RoomLobbyData {
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

    public assignRole(role: RoleID, user: UserID): void {
        this.roomData.roomSetup.roleAssignments[role] = user;
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
        )
    }

    public getGame(): GameInstance | undefined {
        return this.game;
    }
}