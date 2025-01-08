import { GameInstance } from "./gameInstance";
import { RoomDataType, RoomSetupType, TaskID, TaskType } from "./roomTypes";

export class RoomInstance {
    private roomData: RoomDataType;
    private game: GameInstance | undefined;
    
    constructor (roomData: RoomDataType) {
        this.roomData = roomData
    }

    public setSetup(roomSetup: RoomSetupType): void {
        this.roomData.roomSetup = roomSetup;
    }

    public getRoomData(): RoomDataType {
        return this.roomData;
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