import { Server, Socket } from "socket.io";
import { RoleID, RoomLobbyData, UserID, UserType } from "../rooms";

export interface ServerToClientEvents {
    // Util
    ping: (timestamp: number) => void;
    permError: (err: string) => void;
    reqError: (err: string) => void;

    // Room
    latencies: (latencies: { [id: string]: { latency: number } }) => void;
    joinResponse: (success: boolean, info: string | RoomLobbyData) => void;
    userJoined: (id: UserID, user: UserType) => void;
    userLeft: (id: UserID) => void;
    assignedRole: (role: RoleID, user: UserID) => void;

    //Game
}

export interface ClientToServerEvents {
    // Util
    pong: (timestamp: number) => void;

    // Room
    joinRoom: (room: string) => void;
    leaveRoom: () => void;
    assignRole: (role: RoleID, user: UserID) => void;

    // Game
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    uid: string,
}

export type AppSocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type AppServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;