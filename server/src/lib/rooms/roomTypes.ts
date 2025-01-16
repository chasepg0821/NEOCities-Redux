export interface PointType {
    x: number;
    y: number;
}

export type RoleID = number;
export interface RoleType {
    name: string;
    color: string;
    base: PointType;
    resources: ResourceID[];
}

export type UserID = string;
export interface UserType {
    name: string,
    latency: number,
    loaded: boolean
}

export type ResourceID = number;
export interface ResourceType {
    name: string;
    speed: number; // units per second
    asset?: string; // asset location
}

export type TaskID = number;
export interface TaskType {
    name: string;
    start: number; // time, in seconds, at which the task should trigger
    duration: number; // time, in seconds, for how long the task should last
    location: PointType;
    resources: ResourceID[][]; // offers cascading requirements, task is complete when array is empty
}

export interface RoomSetupType {
    time: number; // time in second the game should be played for
    roleAssignments: {
        [id: RoleID]: UserID;
    }
    roles: {
        [id: RoleID]: RoleType;
    }
    resources: {
        [id: ResourceID]: ResourceType;
    }
    tasks: { // all tasks
        [id: TaskID]: TaskType;
    }
}

export interface AdminType {
    id: UserID;
    name: string;
}

export interface RoomInfoType {
    id: string;
    admin: AdminType;
    numUsers: number;
    locked?: boolean; // unused, preperation for adding passwords
}

export interface LobbyDataType {
    id: string;
    admin: AdminType;
    users: {
        [id: string]: UserType;
    }
    roles: {
        [id: RoleID]: {
            name: string;
            color: string;
        }
    }
    roleAssignments: {
        [id: RoleID]: UserID;
    }
}

export enum RoomStateEnum {
    lobby,
    stage,
    play
}
export interface RoomDataType {
    id: string
    state: RoomStateEnum
    admin: AdminType;
    users: {
        [id: string]: UserType;
    }
    roomSetup: RoomSetupType;
}

export interface MessageType {
    user: UserID;
    text: string;
    timestamp: number;
}

export type EntityID = string; // "{RoleID}_{ResourceID}"
export interface EntityDestination {
    name: string;
    steps: PointType[];
}
export interface EntityType {
    speed: number;
    state: "Idle" | "Moving";
    location: PointType;
    destination: EntityDestination;
}

export interface PlayerType {
    role: RoleID;
    ready: boolean;
}

export interface GameScores {
    team: number;
    [id: UserID]: number;
}

export interface GameDataType {
    players: {
        [id: UserID]: PlayerType;
    }
    scores: GameScores;
    messages: MessageType[];
    roles: {
        [id: RoleID]: RoleType;
    }
    entities: {
        [id: EntityID]: EntityType;
    }
    tasks: { // only active tasks
        [id: TaskID]: TaskType;
    }
}