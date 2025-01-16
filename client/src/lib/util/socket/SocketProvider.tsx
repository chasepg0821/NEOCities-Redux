import { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addGenericGameHandlers, addRoomHandlers, addUtilHandlers, ClientSocketType, EmitEvents, ListenEvents, removeGenericGameHandlers, removeRoomHandlers, removeUtilHandlers } from "./socketHandlers";
import { useNavigate } from "@tanstack/react-router";
import { LEFT_ROOM } from "../store/slices/roomSlice";

export interface ISocketContext{
	addListener: <Ev extends keyof ListenEvents>(event: Ev, cb: ListenEvents[Ev]) => void;
	removeListener: <Ev extends keyof ListenEvents>(event: Ev) => void;
	sendEvent: <Ev extends keyof EmitEvents>(event: Ev, ...args: Parameters<EmitEvents[Ev]>) => void;
	connectSocket: () => void;
	disconnectSocket: () => void;
}

const SocketContext = createContext<ISocketContext>(undefined!);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children } : PropsWithChildren) => {
    const socket = useRef<ClientSocketType>();
    const user = useAppSelector((state) => state.auth); //this should never change when mounted, but if it does, it will trigger a rerender and remove from socket anyway (no crazy rerenders due to state on context)
    const nav = useNavigate();
    const dispatch = useAppDispatch();

    const sendEvent = <Ev extends keyof EmitEvents>(event: Ev, ...args: Parameters<EmitEvents[Ev]>) => {
        socket.current?.emit(event, ...args);
    }

    const addListener = <Ev extends keyof ListenEvents>(event: Ev, cb: ListenEvents[Ev]) => {
        // @ts-ignore
        socket.current?.on(event, cb);
    }

    const removeListener = <Ev extends keyof ListenEvents>(event: Ev) => {
        socket.current?.off(event);
    }

    const disconnectSocket = () => {
        if (socket.current) {
            removeUtilHandlers(socket.current);
            removeRoomHandlers(socket.current);
            removeGenericGameHandlers(socket.current);
            socket.current.disconnect();
        }
        socket.current = undefined;
    }

    const connectSocket = () => {
        if (socket.current) disconnectSocket();

        const newSocket = io("http://localhost:3000", {
            auth: {
                uid: user.id,
                uname: user.name,
            }
        });

        newSocket.on("connect", () => {
            if (socket.current?.recovered) {
                console.log("Socket connection recovered.");
            } else {
                console.log("Established new socket connection.")
            }
        });

        newSocket.on("connect_error", (err) => {
            if (newSocket.active) {
                console.log("Temporary connection failure. Reconnecting...");
            } else {
                console.log("Error connecting to server: ", err)
            }
        });

        newSocket.on("disconnect", () => {
            if (newSocket.active) {
                console.log("Temporary connection failure. Reconnecting...");
            } else {
                dispatch(LEFT_ROOM());
                console.log("Closed socket connection.")
            }
        });
      
        addUtilHandlers(newSocket, nav, dispatch);
        addRoomHandlers(newSocket, nav, dispatch);
        addGenericGameHandlers(newSocket, nav, dispatch);

        socket.current = newSocket;
    }

    useEffect(() => {
        connectSocket();
        return () => disconnectSocket();
    }, [])

    return (
        <SocketContext.Provider value={{
            addListener,
            removeListener,
            sendEvent,
            connectSocket,
            disconnectSocket
        }}>
            { children }
        </SocketContext.Provider>
    )
}
