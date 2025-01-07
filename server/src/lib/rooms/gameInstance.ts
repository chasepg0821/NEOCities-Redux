import { GameDataType, RoomSetupType, TaskID } from "./roomTypes";
import { forEach, sortBy } from "lodash"

interface StagedTask {
    id: TaskID;
    start: number;
}

export class GameInstance {
    private gameData: GameDataType;
    private taskStack: StagedTask[] = [];
    private onStage: () => void;
    private onStart: () => void;
    private onEnd: () => void;

    constructor (roomSetup: RoomSetupType, onStage: () => void, onStart: () => void, onEnd: () => void) {
        this.gameData = this.generateGameData(roomSetup);
        this.onStage = onStage;
        this.onStart = onStart;
        this.onEnd = onEnd;
    }

    private generateGameData(roomSetup: RoomSetupType) {
        const gD: GameDataType = {
            players: {},
            messages: [],
            roles: {...roomSetup.roles},
            entities: {},
            tasks: {}
        }

        // generate players
        forEach(roomSetup.roleAssignments, (user, role) => {
            gD.players[user] = {
                role: parseInt(role),
                ready: false
            }
        });

        // generate entities
        forEach(roomSetup.roles, (role, roleID) => {
            forEach(role.resources, (resourceID) => {
                gD.entities[`${roleID}_${resourceID}`] = {
                    speed: roomSetup.resources[resourceID].speed,
                    location: role.base,
                    destination: {
                        name: "Idle",
                        steps: []
                    }
                }
            });
        });

        // generate task stack
        forEach(roomSetup.tasks, (task, taskID) => {
            this.taskStack.push({
                id: parseInt(taskID),
                start: task.start
            });
        });
        this.taskStack = sortBy(this.taskStack, ['start']);
        while(this.taskStack.length >= 1 && this.taskStack[this.taskStack.length - 1].start === 0){
            let newTaskID = this.taskStack.pop()!.id;
            gD.tasks[newTaskID] = {...roomSetup.tasks[newTaskID]}
        }

        this.onStage();
        return gD;
    }

    public start(): void {
        // TODO: start tickrate interval for game logic
        this.onStart();
    }

    public end(): void {
        // TODO: check conditions, save scores, gracefully close game
        this.onEnd();
    }
}