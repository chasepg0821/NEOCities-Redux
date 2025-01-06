import { Server } from "socket.io";

export interface ServerToClientEvents {
    ping: (timestamp: number) => void;
}

export interface ClientToServerEvents {
    joinRoom: (roomID: string) => void;
    leaveRoom: () => void;
    pong: (timestamp: number) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    uid: string,
    uname: string,
}

export type IOServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;