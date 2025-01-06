export interface SocketContextType {
	sendEvent: (event: string, ...args: any[]) => void;
	connectSocket: () => void;
	disconnectSocket: () => void;
	connectionStatus: boolean;
}