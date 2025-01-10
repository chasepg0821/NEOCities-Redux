import { clientDataType } from "./clientTypes";

let clients: ClientManager | undefined = undefined;

export class ClientManager {
    private clientData: Map<string, clientDataType>;

    constructor() {
        this.clientData = new Map<string, clientDataType>();
    }

    public has(id: string): boolean {
        return this.clientData.has(id);
    }

    public get(id: string): clientDataType | undefined {
        return this.clientData.get(id);
    }

    public getIDs(): MapIterator<string> {
        return this.clientData.keys();
    }

    public getLatency(id: string): number | undefined {
        return this.clientData.get(id)?.latency;
    }

    public getRoom(id: string): string | undefined {
        return this.clientData.get(id)?.room;
    }

    public getName(id: string): string | undefined {
        return this.clientData.get(id)?.name;
    }

    public set(id: string, data: clientDataType): void {
        this.clientData.set(id, data);
    }

    public setLatency(id: string, latency: number): void {
        const old = this.clientData.get(id);
        if (old) this.clientData.set(id, { ...old, latency });
    }

    public setRoom(id: string, room: string): void {
        const old = this.clientData.get(id);
        if (old) this.clientData.set(id, { ...old, room });
    }

    public delete(id: string): void {
        this.clientData.delete(id);
    }
}

export const initClients = () => {
    if (!clients) {
        clients = new ClientManager();
        console.log("Initialized Clients...");
    }
}

export const getClients = () => {
    if (!clients) {
        throw new Error("Clients are not initialized.")
    }
    return clients;
}