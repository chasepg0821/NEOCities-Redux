import { AppServerType, getSocketServer } from "../sockets";
import { RoomInstance } from "./roomInstance";
import {
    EntityID,
    EntityType,
    GameDataType,
    PlayerType,
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
    private io: AppServerType = getSocketServer();
    private room: RoomInstance;
    private gameData: GameDataType;
    private taskStack: StagedTask[] = [];
    private FPS: number = 30; //can change this to test feasibility of a smaller
    private TICK_RATE: number = Math.floor(1000 / this.FPS); // ms between each tick
    private DELTA: number = this.TICK_RATE / 1000; // time in seconds between each tick, used to calculate movement of entities based on speed in units/sec
    private gameTime: number = 0;
    private secondInterval: NodeJS.Timeout | undefined = undefined; // Game logic that needs to run every
    private tickInterval: NodeJS.Timeout | undefined = undefined; // Game logic that needs to run every tick (i.e. entity movement, resource checking and points)

    constructor(
        room: RoomInstance,
    ) {
        this.room = room;
        this.gameData = this.generateGameData(room.getSetup());
    }

    private getNewTasks(gameTime: number): { [id: TaskID]: TaskType } | undefined {
        const newTasks: { [id: TaskID]: TaskType } = {};
        let addedNew = false;

        while (
            this.taskStack.length > 0 &&
            this.taskStack[this.taskStack.length - 1].start === gameTime
        ) {
            addedNew = true;
            let newTaskID = this.taskStack.pop()!.id;
            newTasks[newTaskID] = this.room.getTask(newTaskID);
        }

        return addedNew ? cloneDeep(newTasks) : undefined;
    }

    private generateGameData(roomSetup: RoomSetupType) {
        const gD: GameDataType = {
            players: {},
            scores: {
                team: 0,
            },
            messages: [],
            roles: cloneDeep(roomSetup.roles),
            entities: {},
            tasks: {}
        };

        // generate players
        forEach(roomSetup.roleAssignments, (user, role) => {
            gD.players[user] = {
                role: parseInt(role),
                ready: false
            };
            gD.scores[user] = 0;
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
        gD.tasks = this.getNewTasks(0) || {};

        return gD;
    }

    public getPlayers(): {[id: UserID]: PlayerType} {
        return this.gameData.players;
    }

    public playersReady(): boolean {
        forEach(this.getPlayers(), (player, id) => {
            if (!player.ready) return false;
        });
        return true;
    }

    public isPlayer(id: UserID): boolean {
        return this.gameData.players[id] ? true : false;
    }

    public toggleReady(id: UserID): void {
        this.gameData.players[id].ready = !this.gameData.players[id].ready;
        this.io.in(this.room.getID()).emit("toggleReady", id);
    }

    public sendMessage(user: UserID, text: string): void {
        const newMessage = {
            user,
            text,
            timestamp: Date.now(),
        }
        this.gameData.messages.push(newMessage);
        this.io.in(this.room.getID()).emit("newMessage", newMessage);
    }

    private getEntities(): { [id: string]: EntityType } {
        return this.gameData.entities;
    }

    public sendResource(entity: EntityID, task: TaskID): void {
        const [role, resource] = entity.split("_");
        const newDestination = task === 0 ? {
            name: "Base",
            // TODO: generate steps from the navmesh
            steps: [this.gameData.roles[parseInt(role)].base]
        }
        : {
            name: this.room.getTask(task).name,
            // TODO: generate steps from the navmesh
            steps: [this.room.getTask(task).location]
        }

        this.gameData.entities[entity].destination = newDestination;
        this.io.in(this.room.getID()).emit('updateEntityDestination', entity, newDestination);
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
        const newTasks = this.getNewTasks(gameTime);

        if (newTasks) {
            this.gameData.tasks = {
                ...this.gameData.tasks,
                ...newTasks
            }
            this.io.in(this.room.getID()).emit("newTasks", newTasks);
        }
    }

    private runSecondInterval(): void {
        this.secondInterval = setInterval(() => {
            this.gameTime += 1;
            if (this.gameTime === this.room.getGameDuration()) this.end();
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

        // entity did not reach their destination, must move towards their next step as much as possible
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
                        this.io.in(this.room.getID()).emit("completedTask", parseInt(tid));
                        // last resource needed for this phase
                    } else if (resourceIndex > -1 && task.resources[0].length === 1) {
                        task.resources.splice(0, 1);
                        this.io.in(this.room.getID()).emit("updateTaskResources", parseInt(tid), task.resources);
                        // resource needed
                    } else if (resourceIndex > -1) {
                        task.resources[0].splice(resourceIndex, 1);
                        this.io.in(this.room.getID()).emit("updateTaskResources", parseInt(tid), task.resources);
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
        console.log(`Started Game | Room: ${this.room.getID()}`)
        this.io.in(this.room.getID()).emit("startedGame", this.room.getID());
    }

    public pause(): void {
        // this should stop all game logic, socket handlers should check the room state for "play" before changing any state
        clearInterval(this.secondInterval);
        clearInterval(this.tickInterval);
    }

    public end(): void {
        clearInterval(this.secondInterval);
        clearInterval(this.tickInterval);
        console.log(`Ended Game | Room: ${this.room.getID()}`)
        // TODO: check conditions, save scores, gracefully close game
    }
}
