import { RoomInstance } from "./roomInstance";
import {
    EntityType,
    GameDataType,
    PlayerState,
    PointType,
    RoomSetupType,
    TaskID,
    TaskType,
    UserID
} from "./roomTypes";
import { cloneDeep, forEach, sortBy } from "lodash";

interface StagedTask {
    id: TaskID;
    start: number;
}

export class GameInstance {
    private room: RoomInstance;
    private gameData: GameDataType;
    private taskStack: StagedTask[] = [];
    private FPS: number = 30; //can change this to test feasibility of a smaller
    private TICK_RATE: number = Math.floor(1000 / this.FPS); // ms between each tick
    private DELTA: number = this.TICK_RATE / 1000; // time in seconds between each tick, used to calculate movement of entities based on speed in units/sec
    private gameTime: number = 0;
    private secondInterval: NodeJS.Timeout | undefined = undefined; // Game logic that needs to run every
    private tickInterval: NodeJS.Timeout | undefined = undefined; // Game logic that needs to run every tick (i.e. entity movement, resource checking and points)
    private onStage: () => void;
    private onStart: () => void;
    private onEnd: () => void;

    constructor(
        room: RoomInstance,
        onStage: () => void,
        onStart: () => void,
        onEnd: () => void
    ) {
        this.onStage = onStage;
        this.onStart = onStart;
        this.onEnd = onEnd;
        this.room = room;
        this.gameData = this.generateGameData(room.getSetup());
    }

    private getNewTasks(gameTime: number): {[id: TaskID]: TaskType} {
        const newTasks: {[id: TaskID]: TaskType} = {};
    
        while (
            this.taskStack.length > 0 &&
            this.taskStack[this.taskStack.length - 1].start === gameTime
        ) {
            let newTaskID = this.taskStack.pop()!.id;
            newTasks[newTaskID] = this.room.getTask(newTaskID);
        }

        return cloneDeep(newTasks);
    }

    private generateGameData(roomSetup: RoomSetupType) {
        const gD: GameDataType = {
            players: {},
            messages: [],
            roles: cloneDeep(roomSetup.roles),
            entities: {},
            tasks: {}
        };

        // generate players
        forEach(roomSetup.roleAssignments, (user, role) => {
            gD.players[user] = {
                role: parseInt(role),
                state: "waiting"
            };
        });

        // generate entities
        forEach(roomSetup.roles, (role, roleID) => {
            forEach(role.resources, (resourceID) => {
                gD.entities[`${roleID}_${resourceID}`] = {
                    speed: roomSetup.resources[resourceID].speed,
                    state: "Idle",
                    location: role.base,
                    destination: {
                        name: "Base",
                        steps: []
                    }
                };
            });
        });

        // generate task stack
        forEach(roomSetup.tasks, (task, taskID) => {
            this.taskStack.push({
                id: parseInt(taskID),
                start: task.start
            });
        });
        this.taskStack = sortBy(this.taskStack, ["start"]);
        gD.tasks = this.getNewTasks(0);

        this.onStage();
        return gD;
    }

    public isPlayer(id: UserID): boolean {
        return this.gameData.players[id] ? true : false;
    }

    public setPlayerState(id: UserID, state: PlayerState): void {
        this.gameData.players[id].state = state;
    }

    private getEntities(): { [id: string]: EntityType } {
        return this.gameData.entities;
    }

    private getTasks(): { [id: TaskID]: TaskType } {
        return this.gameData.tasks;
    }

    private removeTask(id: TaskID): void {
        delete this.gameData.tasks[id];
    }

    public getGameData(): GameDataType {
        return this.gameData;
    }

    private addNewTasks(gameTime: number): void {
        this.gameData.tasks = {
            ...this.gameData.tasks,
            ...this.getNewTasks(gameTime)
        }

        // TODO: notify clients of new tasks
    }

    private runSecondInterval(): void {
        this.secondInterval = setInterval(() => {
            this.gameTime += 1;
            this.addNewTasks(this.gameTime);
        }, 1000);
    }

    private calcDistance(p1: PointType, p2: PointType): number {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }

    private calcEntityMove(entity: EntityType): void {
        // no where to go
        if (entity.destination.steps.length === 0) return;

        const location = entity.location;
        const steps = entity.destination.steps;

        // go through as many of the steps
        let distLeft = entity.speed * this.DELTA;
        let distance = 0;
        while (steps.length > 0) {
            distance = this.calcDistance(steps[steps.length - 1], location);

            // the unit cant make it to the next step in this tick
            if (distance > distLeft) break;

            // move the unit to the step, and remove the distance from their distance left
            distLeft -= distance;
            entity.location = steps.pop()!;
        }

        // entity did not reach their destination, must move towrds their next step as much as possible
        if (steps.length > 0) {
            const ratio = distLeft / distance;
            entity.location = {
                x:
                    ((1 - ratio) * entity.location.x +
                        ratio * steps[steps.length - 1].x) >>
                    0,
                y:
                    ((1 - ratio) * entity.location.y +
                        ratio * steps[steps.length - 1].y) >>
                    0
            };
            // arrived at their destination
        } else {
            entity.state = "Idle";
        }
    }

    private moveEntities(): void {
        forEach(this.getEntities(), (entity) => this.calcEntityMove(entity));
    }

    private checkTasksForResources(): void {
        forEach(this.getTasks(), (task, tid) => {
            forEach(this.getEntities(), (entity, eid) => {
                const [role, resource] = eid.split("_");
                if (entity.location === task.location) {
                    const resourceIndex = task.resources[0].indexOf(parseInt(resource));

                    // last resource needed
                    if (resourceIndex > -1 && task.resources[0].length === 1 && task.resources.length === 1) {
                        this.removeTask(parseInt(tid));
                        // TODO: add score and tell users of the completed task
                    // last resource needed for this phase
                    } else if (resourceIndex > -1 && task.resources[0].length === 1) {
                        task.resources.splice(0, 1);
                        // TODO: add score and resend resources to clients for the task
                    // resource needed
                    } else if (resourceIndex > -1) {
                        task.resources[0].splice(resourceIndex, 1);
                        // TODO: add score and resend resources to clients for the task
                    }
                    
                }
            });
        });
    }

    private runTickInterval(): void {
        this.tickInterval = setInterval(() => {
            this.moveEntities();
            this.checkTasksForResources();
        }, this.TICK_RATE);
    }

    public start(): void {
        this.runSecondInterval();
        this.runTickInterval();
        this.onStart();
    }

    public pause(): void {
        // this should stop all game logic, socket handlers should check the room state for "play" before changing any state
        clearInterval(this.secondInterval);
        clearInterval(this.tickInterval);
    }

    public end(): void {
        clearInterval(this.secondInterval);
        clearInterval(this.tickInterval);
        // TODO: check conditions, save scores, gracefully close game
        this.onEnd();
    }
}
