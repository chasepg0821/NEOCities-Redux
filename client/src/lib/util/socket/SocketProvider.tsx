import { createContext, PropsWithChildren, useEffect, useRef } from "react";
import { SocketContextType } from "./SocketContextType";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ClientSocketType, EmitEvents, ListenEvents } from "./SocketType";
import { addRoomHandlers, addUtilHandlers, removeRoomHandlers, removeUtilHandlers } from "./socketHandlers";
import { useNavigate } from "@tanstack/react-router";

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children } : PropsWithChildren) => {
    const socket = useRef<ClientSocketType>();
    const user = useAppSelector((state) => state.auth);
    const nav = useNavigate();
    const dispatch = useAppDispatch();

    const addListener = (event: keyof ListenEvents, cb: (...args: any[]) => void) => {
        socket.current?.on(event, cb);
    }

    const removeListener = (event: keyof ListenEvents) => {
        socket.current?.off(event);
    }

    const sendEvent = (event: keyof EmitEvents, ...args: Parameters<EmitEvents[keyof EmitEvents]>) => {
        socket.current?.emit(event, ...args);
    }

    const disconnectSocket = () => {
        if (socket.current) {
            removeUtilHandlers(socket.current);
            removeRoomHandlers(socket.current);
            socket.current?.disconnect();
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
        })

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
                console.log("Closed socket connection.")
            }
        });
      
        addUtilHandlers(newSocket, nav);
        addRoomHandlers(newSocket, nav, dispatch);

        socket.current = newSocket;
    }

    useEffect(() => {
        if (!socket.current) connectSocket();
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