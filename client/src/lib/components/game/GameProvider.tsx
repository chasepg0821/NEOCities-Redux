import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef
} from "react";
import { EntityID, GameDataType, UserID } from "../../util/store/roomTypes";
import { useSocketContext } from "../../util/socket/SocketProvider";
import { useDispatch } from "react-redux";
import { COMPLETED_TASK, NEW_MESSAGE, NEW_TASKS, SCORES, STAGED_GAME, UPDATE_ENTITY_DEST, UPDATE_TASK_RESOURCES } from "../../util/store/slices/gameSlice";
import { useNavigate } from "@tanstack/react-router";

interface IGameContext {
    fetchGameData: () => Promise<void>;
    setGameData: (setter: (gD: GameDataType) => void) => void;
    getGameData: (getter: (gD: GameDataType) => any) => any;
}

const GameContext = createContext<IGameContext>(undefined!);

export const useGameContext = () => useContext(GameContext);

interface GameContextProps extends PropsWithChildren {
    room: string;
    user: UserID;
}

export const GameProvider = ({ room, user, children }: GameContextProps) => {
    const gameData = useRef<GameDataType>();
    const socketContext = useSocketContext();
    const dispatch = useDispatch();
    const nav = useNavigate();

    const fetchGameData = async () => {
        return fetch(`http://localhost:3000/api/rooms/${room}/game?uid=${user}`)
            .then((res) => {
                if (!res.ok) {
                    throw Error("Response was not ok!");
                }
                return res.json();
            })
            .then((data) => {
                dispatch(STAGED_GAME(data.game));
                gameData.current = data.game;
                socketContext.sendEvent("loadedGameData");
            });
    };

    const setGameData = (setter: (gD: GameDataType) => void) => {
        if (gameData.current) setter(gameData.current);
    };
    const getGameData = (getter: (gD: GameDataType) => any) => {
        return gameData.current ? getter(gameData.current) : undefined;
    };

    const addGameHandlers = () => {
        socketContext.addListener("startedGame", () => {
            nav({ 
                to: "/rooms/$roomID/game/play", 
                params: { roomID: room } 
            });
        });
        socketContext.addListener("updateEntityDestination", (id, destination) => {
            if (gameData.current) gameData.current.entities[id].destination = destination;
            dispatch(UPDATE_ENTITY_DEST({id, destination}));
        });
        socketContext.addListener("newTasks", (tasks) => {
            if (gameData.current) gameData.current.tasks = {
                ...gameData.current.tasks,
                ...tasks
            }
            dispatch(NEW_TASKS(tasks));
        });
        socketContext.addListener("updateTaskResources", (id, resources) => {
            if (gameData.current) gameData.current.tasks[id].resources = resources;
            dispatch(UPDATE_TASK_RESOURCES({id, resources}));
        });
        socketContext.addListener("completedTask", (id) => {
            if (gameData.current) delete gameData.current.tasks[id];
            dispatch(COMPLETED_TASK(id));
        });
        socketContext.addListener("scores", (scores) => {
            if (gameData.current) gameData.current.scores = scores;
            dispatch(SCORES(scores));
        });
        socketContext.addListener("newMessage", (message) => {
            if (gameData.current) gameData.current.messages.push(message);
            dispatch(NEW_MESSAGE(message));
        })
    }

    const removeGameHandlers = () => {
        socketContext.removeListener("startedGame");
        socketContext.removeListener("updateEntityDestination");
        socketContext.removeListener("newTasks");
        socketContext.removeListener("updateTaskResources");
        socketContext.removeListener("completedTask");
        socketContext.removeListener("scores");
        socketContext.removeListener("newMessage");
    }

    useEffect(() => {
        addGameHandlers();
        return removeGameHandlers();
    }, []);

    return (
        <GameContext.Provider
            value={{
                fetchGameData,
                setGameData,
                getGameData
            }}>
            {children}
        </GameContext.Provider>
    );
};
