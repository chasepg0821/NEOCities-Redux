import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef
} from "react";
import { GameDataType, UserID } from "../../util/store/roomTypes";
import { useSocketContext } from "../../util/socket/SocketProvider";
import { useDispatch } from "react-redux";
import {
    COMPLETED_TASK,
    NEW_MESSAGE,
    NEW_TASKS,
    SCORES,
    SET_READY,
    STAGED_GAME,
    UPDATE_ENTITY_DEST,
    UPDATE_TASK_RESOURCES
} from "../../util/store/slices/gameSlice";
import { useNavigate } from "@tanstack/react-router";
import { LOADED_GAME_DATA } from "@/lib/util/store/slices/roomSlice";

interface IGameContext {
    setGameData: (gD: GameDataType) => void;
    getGameData: () => GameDataType | undefined;
    addHandlers: () => void;
    removeHandlers: () => void;
    // getGameData: (getter: (gD: GameDataType) => any) => any;
}

const GameContext = createContext<IGameContext>(undefined!);

export const useGameContext = () => useContext(GameContext);

interface GameContextProps extends PropsWithChildren {
    room: string;
    user: UserID;
}

export const GameProvider = ({ room, children }: GameContextProps) => {
    const gameData = useRef<GameDataType>();
    const socketContext = useSocketContext();
    const dispatch = useDispatch();
    const nav = useNavigate();

    const setGameData = (gD: GameDataType) => {
        if (gD) {
            gameData.current = gD;
            dispatch(STAGED_GAME(gD));
            removeHandlers();
            addHandlers();
            socketContext.sendEvent("loadedGameData");
        }
    }

    const getGameData = (): GameDataType | undefined => {
        return gameData.current;
    }

    const addHandlers = () => {
        console.log(socketContext.getSocket() ? true : false);
        socketContext.getSocket()?.on("loadedGameData", (id) => {
            dispatch(LOADED_GAME_DATA(id));
        });
        socketContext.getSocket()?.on("startedGame", () => {
            nav({
                to: "/rooms/$roomID/game/play",
                params: { roomID: room }
            });
        });
        socketContext.getSocket()?.on(
            "updateEntityDestination",
            (id, destination) => {
                if (gameData.current)
                    gameData.current.entities[id].destination = destination;
                dispatch(UPDATE_ENTITY_DEST({ id, destination }));
            }
        );
        socketContext.getSocket()?.on("newTasks", (tasks) => {
            if (gameData.current)
                gameData.current.tasks = {
                    ...gameData.current.tasks,
                    ...tasks
                };
            dispatch(NEW_TASKS(tasks));
        });
        socketContext.getSocket()?.on("updateTaskResources", (id, resources) => {
            if (gameData.current)
                gameData.current.tasks[id].resources = resources;
            dispatch(UPDATE_TASK_RESOURCES({ id, resources }));
        });
        socketContext.getSocket()?.on("completedTask", (id) => {
            if (gameData.current) delete gameData.current.tasks[id];
            dispatch(COMPLETED_TASK(id));
        });
        socketContext.getSocket()?.on("scores", (scores) => {
            if (gameData.current) gameData.current.scores = scores;
            dispatch(SCORES(scores));
        });
        socketContext.getSocket()?.on("newMessage", (message) => {
            if (gameData.current) gameData.current.messages.push(message);
            dispatch(NEW_MESSAGE(message));
        });
        socketContext.getSocket()?.on("setReady", (id, ready) => {
            dispatch(SET_READY({
                id,
                ready
            }));
        });
    };

    const removeHandlers = () => {
        socketContext.removeListener("loadedGameData");
        socketContext.removeListener("startedGame");
        socketContext.removeListener("updateEntityDestination");
        socketContext.removeListener("newTasks");
        socketContext.removeListener("updateTaskResources");
        socketContext.removeListener("completedTask");
        socketContext.removeListener("scores");
        socketContext.removeListener("newMessage");
        socketContext.removeListener("setReady");
    };

    useEffect(() => {
        addHandlers();
        return () => removeHandlers();
    }, []);

    return (
        <GameContext.Provider
            value={{
                setGameData,
                getGameData,
                addHandlers,
                removeHandlers
            }}>
            {children}
        </GameContext.Provider>
    );
};
