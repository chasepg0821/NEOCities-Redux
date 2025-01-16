import { useAppSelector } from "@/lib/util/store/hooks";
import { map } from "lodash";
import { MdDownloadDone, MdPerson } from "react-icons/md";

import "./PlayerStage.scss";
import Card from "../../../generic/Card/Card";
import { useSocketContext } from "@/lib/util/socket/SocketProvider";
import { FaChess } from "react-icons/fa";


const PlayerStage = () => {
    const user = useAppSelector((state) => state.auth.id);
    const users = useAppSelector((state) => state.room.users);
    const players = useAppSelector((state) => state.game.players);
    const socket = useSocketContext();

    const toggleReady = () => {
        socket.sendEvent("toggleReady", user);
    }

    return (
        <Card
            title="Players"
            icon={<FaChess />}
            actions={players[user] && users[user].loaded ? [
                <button className="action" onClick={toggleReady} key={"toggle-ready"}>Toggle Ready</button>
            ] : undefined}
        >
            <ul className="player-stage">
                {map(players, (player, pid) => (
                    <li key={pid}>
                        <span>{users[pid]?.name}</span>
                        <div className="player-info">
                            <MdDownloadDone color={player.ready ? "green" : "lightgrey"} />
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default PlayerStage;
