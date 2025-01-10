import { AppServerType, AppSocketType } from "../../socketTypes"
import { pong } from "./pong";

export const addUtilHandlers = (socket: AppSocketType) => {
    socket.on("pong", (timestamp: number) => {
        pong(socket, timestamp);
      });
}
