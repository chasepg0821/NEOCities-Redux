import { RoomInstance } from "./roomInstance";
import { RoomDataType } from "./roomTypes";
let rooms: RoomsManager | undefined = undefined;

export class RoomsManager {
    private rooms: Map<string, RoomInstance>;

    constructor() {
        this.rooms = new Map<string, RoomInstance>(); 
    }

    public hasRoom(room: string): boolean {
        return this.rooms.has(room);
    }

    public getRoom(room: string): RoomInstance | undefined {
        return this.rooms.get(room);
    }

    public getMap(): Map<string, RoomInstance> {
        return this.rooms;
    }

    public add(roomData: RoomDataType): void {
        this.rooms.set(roomData.id, new RoomInstance(roomData));
    }

    public delete(id: string): void {
        this.rooms.delete(id);
    }
}

export const initRooms = () => {
    if (!rooms) rooms = new RoomsManager();
}

export const getRooms = (): RoomsManager => {
    if (!rooms) throw new Error("Rooms not initialized.");
    return rooms;
}