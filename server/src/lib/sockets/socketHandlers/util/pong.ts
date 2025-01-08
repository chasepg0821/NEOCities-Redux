import { getClients } from "../../../clients";
import { AppSocketType } from "../../socketTypes";

export const pong = (socket: AppSocketType, timestamp: number) => {
    const latency = Date.now() - timestamp;
    getClients().setLatency(socket.data.uid, latency);
}