import { createContext, PropsWithChildren, useEffect, useRef, useState } from "react";
import { SocketContextType } from "./SocketContextType";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../store/hooks";

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children } : PropsWithChildren) => {
    const socket = useRef<Socket>();
    const user = useAppSelector((state) => state.auth);

    const sendEvent = (event: string, ...args: any[]) => {
        socket.current?.emit(event, ...args);
    }

    const disconnectSocket = () => {
        socket.current?.disconnect();
        socket.current = undefined;
    }

    const connectSocket = () => {
        if (socket.current) {
            disconnectSocket();
        };

        const newSocket = io("http://localhost:3000", {
            auth: {
                uid: user.id,
                uname: user.name,
            }
        })

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });
      
        // Respond to ping with pong and include the timestamp
        newSocket.on('ping', (timestamp) => {
            console.log('Received ping from server');
            newSocket.emit('pong', timestamp);
        });

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
            disconnectSocket,
            connectionStatus: socket.current?.connected || false
        }}>
            { children }
        </SocketContext.Provider>
    )
}