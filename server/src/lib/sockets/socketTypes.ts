import { Server, Socket } from "socket.io";

export interface ServerToClientEvents {
    ping: (timestamp: number) => void;
    joinedRoom: (success: boolean, reason?: string) => void; 
}

export interface ClientToServerEvents {
    joinRoom: (room: string) => void;
    leaveRoom: () => void;
    pong: (timestamp: number) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    uid: string,
}

export type AppSocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type AppServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;