import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef
} from "react";
import { io } from "socket.io-client";
import { useAppDispatch } from "../store/hooks";
import {
    addRoomHandlers,
    addUtilHandlers,
    ClientSocketType,
    EmitEvents,
    ListenEvents,
    removeRoomHandlers,
    removeUtilHandlers
} from "./socketHandlers";
import { useNavigate } from "@tanstack/react-router";
import { LEFT_ROOM } from "../store/slices/roomSlice";

export interface ISocketContext {
    getSocket: () => ClientSocketType | undefined;
    addListener: <Ev extends keyof ListenEvents>(
        event: Ev,
        cb: ListenEvents[Ev]
    ) => void;
    removeListener: <Ev extends keyof ListenEvents>(event: Ev) => void;
    sendEvent: <Ev extends keyof EmitEvents>(
        event: Ev,
        ...args: Parameters<EmitEvents[Ev]>
    ) => void;
}

const SocketContext = createContext<ISocketContext>(undefined!);

export const useSocketContext = () => useContext(SocketContext);

interface SocketProviderProps extends PropsWithChildren {
    user: {
        id: string,
        name: string
    }
}

export const SocketProvider = ({ user, children }: SocketProviderProps) => {
    const socket = useRef<ClientSocketType>();
    const nav = useNavigate();
    const dispatch = useAppDispatch();

    if (!socket.current) {
        socket.current = io("http://localhost:3000", {
            auth: {
                uid: user.id,
                uname: user.name
            }
        });

        socket.current.on("connect", () => {
            if (socket.current?.recovered) {
                console.log("Socket connection recovered.");
            } else {
                console.log("Established new socket connection.");
            }
        });

        socket.current.on("connect_error", (err) => {
            if (socket.current?.active) {
                console.log("Temporary connection failure. Reconnecting...");
            } else {
                console.log("Error connecting to server: ", err);
            }
        });

        socket.current.on("disconnect", () => {
            if (socket.current?.active) {
                console.log("Temporary connection failure. Reconnecting...");
            } else {
                nav({
                    to: "/rooms"
                })
                dispatch(LEFT_ROOM());
                console.log("Closed socket connection.");
            }
        });

        addUtilHandlers(socket.current, nav, dispatch);
        addRoomHandlers(socket.current, nav, dispatch);
    }

    const sendEvent = <Ev extends keyof EmitEvents>(
        event: Ev,
        ...args: Parameters<EmitEvents[Ev]>
    ) => {
        socket.current?.emit(event, ...args);
    };

    const getSocket = (): ClientSocketType | undefined => {
        return socket.current;
    }

    const addListener = <Ev extends keyof ListenEvents>(
        event: Ev,
        cb: ListenEvents[Ev]
    ) => {
        // @ts-ignore
        socket.current?.on(event, cb);
    };

    const removeListener = <Ev extends keyof ListenEvents>(event: Ev) => {
        socket.current?.off(event);
    };

    const disconnectSocket = () => {
        if (socket.current) {
            removeUtilHandlers(socket.current);
            removeRoomHandlers(socket.current);
            socket.current.disconnect();
        }
        socket.current = undefined;
    };

    useEffect(() => {
        return () => disconnectSocket();
    }, []);

    return (
        <SocketContext.Provider
            value={{
                getSocket,
                addListener,
                removeListener,
                sendEvent
            }}>
            {children}
        </SocketContext.Provider>
    );
};
