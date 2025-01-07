import { RoomInstance } from "./roomInstance";

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

    public keys(): MapIterator<string> {
        return this.rooms.keys();
    }

    public add(room: string, roomSetup: any) {
        this.rooms.set(room, new RoomInstance(roomSetup));
    }
}