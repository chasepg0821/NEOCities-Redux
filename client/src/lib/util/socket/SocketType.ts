import { Socket } from "socket.io-client";
import { RoleID, LobbyDataType, UserID, UserType } from "../store/roomTypes";

export interface ListenEvents {
    // Util
    ping: (timestamp: number) => void;
    permError: (err: string) => void;
    reqError: (err: string) => void;

    // Room
    latencies: (latencies: { [id: string]: { latency: number } }) => void;
    joinResponse: (success: boolean, info: string | LobbyDataType) => void;
    userJoined: (id: UserID, user: UserType) => void;
    userLeft: (id: UserID) => void;
    assignedRole: (role: RoleID, user: UserID) => void;

    //Game
}

export interface EmitEvents {
    // Util
    pong: (timestamp: number) => void;

    // Room
    joinRoom: (room: string) => void;
    leaveRoom: () => void;
    assignRole: (role: RoleID, user: UserID) => void;

    // Game
}

export type ClientSocketType = Socket<ListenEvents, EmitEvents>;
