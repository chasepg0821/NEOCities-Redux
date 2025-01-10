import { createContext, PropsWithChildren, useEffect, useRef } from "react";
import { SocketContextType } from "./SocketContextType";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ClientSocketType, EmitEvents, ListenEvents } from "./SocketType";
import { addGameHandlers, addRoomHandlers, addUtilHandlers, removeGameHandlers, removeRoomHandlers, removeUtilHandlers } from "./socketHandlers";
import { useNavigate } from "@tanstack/react-router";

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children } : PropsWithChildren) => {
    const socket = useRef<ClientSocketType>();
    const user = useAppSelector((state) => state.auth);
    const nav = useNavigate();
    const dispatch = useAppDispatch();

    const sendEvent = (event: keyof EmitEvents, ...args: Parameters<EmitEvents[keyof EmitEvents]>) => {
        socket.current?.emit(event, ...args);
    }

    const disconnectSocket = () => {
        if (socket.current) {
            removeUtilHandlers(socket.current);
            removeRoomHandlers(socket.current);
            removeGameHandlers(socket.current);
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
      
        addUtilHandlers(newSocket, nav, dispatch);
        addRoomHandlers(newSocket, nav, dispatch);
        addGameHandlers(newSocket, nav, dispatch);

        socket.current = newSocket;
    }

    useEffect(() => {
        connectSocket();
        return () => disconnectSocket();
    }, [])

    return (
        <SocketContext.Provider value={{
            sendEvent,
            connectSocket,
            disconnectSocket
        }}>
            { children }
        </SocketContext.Provider>
    )
}