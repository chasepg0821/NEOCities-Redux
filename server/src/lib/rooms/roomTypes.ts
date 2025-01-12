export interface PointType {
    x: number;
    y: number;
}

export type RoleID = number;
export interface RoleType {
    name: string;
    color: string;
    base: PointType;
    resources: number[];
}

export type UserID = string;
export type UserState = "waiting" | "loaded";
export interface UserType {
    name: string,
    latency: number,
    state: UserState
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
    resources: number[][]; // offers cascading requirements, task is complete when array is empty
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

export interface RoomInfoType {
    id: string;
    admin: {
        id: UserID,
        name: string,
    };
    numUsers: number;
    locked?: boolean; // unused, preperation for adding passwords
}

export interface LobbyDataType {
    id: string;
    admin: {
        id: UserID,
        name: string,
    };
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

export interface RoomDataType {
    id: string
    admin: {
        id: UserID;
        name: string;
    };
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
export interface EntityType {
    speed: number;
    location: PointType;
    destination: {
        name: string; // task name or base
        steps: PointType[];
    }
}

export type PlayerState = UserState | "ready";
export interface GameDataType {
    players: {
        [id: UserID]: {
            role: RoleID;
            state: PlayerState;
        }
    }
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