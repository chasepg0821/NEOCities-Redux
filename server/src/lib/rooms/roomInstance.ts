import { GameInstance } from "./gameInstance";
import { RoomDataType, RoomLobbyData, RoomSetupType, TaskID, TaskType, UserID, UserType } from "./roomTypes";

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

    public getLobbyData(): RoomLobbyData {
        return {
            id: this.roomData.id,
            admin: this.getAdmin(),
            users: this.getUsers(),
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
        )
    }

    public getGame(): GameInstance | undefined {
        return this.game;
    }
}