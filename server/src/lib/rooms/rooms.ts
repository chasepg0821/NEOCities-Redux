import { RoomInstance } from "./roomInstance";
import { RoomDataType } from "./roomTypes";
let rooms: RoomsManager | undefined = undefined;

export class RoomsManager {
    private rooms: Map<string, RoomInstance>;

    constructor() {
        this.rooms = new Map<string, RoomInstance>(); 
    }

    public has(room: string): boolean {
        return this.rooms.has(room);
    }

    public get(room: string): RoomInstance | undefined {
        return this.rooms.get(room);
    }

    public getMap() {
        return this.rooms;
    }

    public keys(): MapIterator<string> {
        return this.rooms.keys();
    }

    public add(roomData: RoomDataType) {
        this.rooms.set(roomData.id, new RoomInstance(roomData));
    }
}

export const initRooms = () => {
    if (!rooms) rooms = new RoomsManager();
}

export const getRooms = (): RoomsManager => {
    if (!rooms) throw new Error("Rooms not initialized.");
    return rooms;
}