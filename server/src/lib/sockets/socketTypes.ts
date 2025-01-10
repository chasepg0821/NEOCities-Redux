import { Server, Socket } from "socket.io";
import { RoleID, LobbyDataType, UserID, UserType } from "../rooms";

export interface ServerToClientEvents {
    // Util
    ping: (timestamp: number) => void;
    permError: (err: string) => void;
    reqError: (err: string) => void;

    // Room
    latencies: (latencies: { [id: string]: { latency: number } }) => void;
    userJoined: (id: UserID, user: UserType) => void;
    userLeft: (id: UserID) => void;
    assignedRole: (role: RoleID, user: UserID) => void;
    stagedGame: (room: string) => void;

    //Game
}

export interface ClientToServerEvents {
    // Util
    pong: (timestamp: number) => void;

    // Room
    leaveRoom: () => void;
    assignRole: (role: RoleID, user: UserID) => void;
    stageGame: () => void;

    // Game
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    uid: string,
    room: string
}

export type AppSocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type AppServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;