import { GameInstance } from "./gameInstance";
import { RoomDataType, RoomSetupType, TaskID, TaskType } from "./roomTypes";

export class RoomInstance {
    private roomData: RoomDataType;
    private game: GameInstance | undefined;
    
    constructor (roomData: RoomDataType) {
        this.roomData = roomData
    }

    public updateSetup(roomSetup: RoomSetupType): void {
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

    public getTasks(): { [id: TaskID]: TaskType } {
        return this.roomData.roomSetup.tasks;
    }

    public getGame(): GameInstance | undefined {
        return this.game;
    }
}