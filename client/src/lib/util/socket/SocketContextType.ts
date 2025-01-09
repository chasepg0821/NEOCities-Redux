import { EmitEvents, ListenEvents } from "./SocketType";

export interface SocketContextType {
	sendEvent: (event: keyof EmitEvents, ...args: any[]) => void;
	connectSocket: () => void;
	disconnectSocket: () => void;
}