import { Socket } from "socket.io-client";
import { RoomLobbyData, UserID, UserType } from "../store/roomTypes";

export interface ListenEvents {
    ping: (timestamp: number) => void;
    latencies: (latencies: { [id: string]: { latency: number } }) => void;
    joinResponse: (success: boolean, info?: string | RoomLobbyData) => void;
    userJoined: (user: UserType) => void;
    userLeft: (id: UserID) => void;
}

export interface EmitEvents {
    joinRoom: (room: string) => void;
    leaveRoom: () => void;
    pong: (timestamp: number) => void;
}

export type ClientSocketType = Socket<ListenEvents, EmitEvents>;
