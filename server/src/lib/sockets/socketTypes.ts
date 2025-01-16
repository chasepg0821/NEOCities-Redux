import { Server, Socket } from "socket.io";
import { EntityDestination, EntityID, EntityType, GameScores, MessageType, PointType, ResourceID, RoleID, TaskID, TaskType, UserID, UserType } from "../rooms";

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

    // Game
    startedGame: (id: string) => void;
    loadedGameData: (id: UserID) => void;
    toggleReady: (id: UserID) => void;
    updateEntityDestination: (id: EntityID, destination: EntityDestination) => void;
    newTasks: (tasks: { [id: TaskID]: TaskType }) =>  void;
    updateTaskResources: (id: TaskID, resources: ResourceID[][]) =>  void;
    completedTask: (id: TaskID) => void;
    scores: (scores: GameScores) => void;
    newMessage: (message: MessageType) => void;
}

export interface ClientToServerEvents {
    // Util
    pong: (timestamp: number) => void;

    // Room
    leaveRoom: () => void;
    assignRole: (role: RoleID, user: UserID) => void;
    stageGame: () => void;

    // Game
    loadedGameData: () => void;
    toggleReady: () => void;
    startGame: () => void;
    sendResource: (entity: EntityID, task: TaskID) => void;
    sendMessage: (text: string) => void;
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