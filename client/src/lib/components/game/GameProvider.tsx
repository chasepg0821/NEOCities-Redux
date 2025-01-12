import {
    createContext,
    PropsWithChildren,
    useContext,
    useRef
} from "react";
import { GameDataType, UserID } from "../../util/store/roomTypes";
import { useSocketContext } from "../../util/socket/SocketProvider";
import { useDispatch } from "react-redux";
import { STAGED_GAME } from "../../util/store/slices/gameSlice";

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
