import { Socket } from "socket.io-client";
import { EntityDestination, EntityID, GameScores, MessageType, ResourceID, RoleID, TaskID, TaskType, UserID, UserType } from "../../store/roomTypes";

export interface ListenEvents {
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
    startedGame: () => void;
    loadedGameData: (id: UserID) => void;
    updateEntityDestination: (id: EntityID, destination: EntityDestination) => void;
    newTasks: (tasks: { [id: TaskID]: TaskType }) =>  void;
    updateTaskResources: (id: TaskID, resources: ResourceID[][]) =>  void;
    completedTask: (id: TaskID) => void;
    scores: (scores: GameScores) => void;
    newMessage: (message: MessageType) => void;
}

export interface EmitEvents {
    // Util
    pong: (timestamp: number) => void;

    // Room
    leaveRoom: () => void;
    assignRole: (role: RoleID, user: UserID) => void;
    stageGame: () => void;

    // Game
    loadedGameData: () => void;
    sendResource: (entity: EntityID, task: TaskID) => void;
    sendMessage: (text: string) => void;
}

export type ClientSocketType = Socket<ListenEvents, EmitEvents>;