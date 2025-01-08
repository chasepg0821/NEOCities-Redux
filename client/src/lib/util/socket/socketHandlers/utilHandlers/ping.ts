import { ClientSocketType } from "../../SocketType"

export const ping = (socket: ClientSocketType, timestamp: number) => {
    socket.emit("pong", timestamp);
}