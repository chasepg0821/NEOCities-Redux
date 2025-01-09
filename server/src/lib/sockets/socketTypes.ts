import { Server, Socket } from "socket.io";
import { RoleID, RoomLobbyData, UserID, UserType } from "../rooms";

export interface ServerToClientEvents {
    ping: (timestamp: number) => void;
    latencies: (latencies: { [id: string]: { latency: number } }) => void;
    joinResponse: (success: boolean, info: string | RoomLobbyData) => void;
    userJoined: (id: UserID, user: UserType) => void;
    userLeft: (id: UserID) => void;
}

export interface ClientToServerEvents {
    joinRoom: (room: string) => void;
    leaveRoom: () => void;
    assignRole: (role: RoleID, user: UserID) => void;
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