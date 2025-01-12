import { ClientSocketType } from "../events";

export const ping = (socket: ClientSocketType, timestamp: number) => {
    socket.emit("pong", timestamp);
}