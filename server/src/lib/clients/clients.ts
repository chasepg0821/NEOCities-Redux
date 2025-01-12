import { clientDataType } from "./clientTypes";

let clients: ClientManager | undefined = undefined;

export class ClientManager {
    private clientData: Map<string, clientDataType>;

    constructor() {
        this.clientData = new Map<string, clientDataType>();
    }

    public hasClient(id: string): boolean {
        return this.clientData.has(id);
    }

    public getClient(id: string): clientDataType | undefined {
        return this.clientData.get(id);
    }

    public add(id: string, data: clientDataType): void {
        this.clientData.set(id, data);
    }

    public setLatency(id: string, latency: number): void {
        const old = this.clientData.get(id);
        if (old) this.clientData.set(id, { ...old, latency });
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