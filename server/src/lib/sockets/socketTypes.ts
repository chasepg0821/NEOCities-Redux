import { Server, Socket } from "socket.io";

export interface ServerToClientEvents {
    ping: (timestamp: number) => void;
    joinResponse: (success: boolean, reason?: string) => void; 
}

export interface ClientToServerEvents {
    joinRoom: (room: string, password?: string) => void;
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