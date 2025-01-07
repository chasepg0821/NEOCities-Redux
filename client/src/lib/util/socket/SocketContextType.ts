import { Socket } from "socket.io-client";
import { EmitEvents, ListenEvents } from "./SocketType";

export interface SocketContextType {
	addListener: (event: keyof ListenEvents, cb: (...args: any[]) => void) => void;
	removeListener: (event: keyof ListenEvents) => void;
	sendEvent: (event: keyof EmitEvents, ...args: any[]) => void;
	connectSocket: () => void;
	disconnectSocket: () => void;
}