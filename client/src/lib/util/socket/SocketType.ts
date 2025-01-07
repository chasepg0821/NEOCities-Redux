import { Socket } from "socket.io-client";

export interface ListenEvents {
    ping: (timestamp: number) => void;
    joinResponse: (success: boolean, reason?: string) => void; 
}

export interface EmitEvents {
    joinRoom: (room: string) => void;
    leaveRoom: () => void;
    pong: (timestamp: number) => void;
}

export type ClientSocketType = Socket<ListenEvents, EmitEvents>;
