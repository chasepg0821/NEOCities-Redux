import { useAppSelector } from "@/lib/util/store/hooks";

import "./LobbyInfo.scss";
import { map } from "lodash";

type Props = {};

const LobbyInfo = (props: Props) => {
    const roomAdmin = useAppSelector((state) => state.room.admin);
    const roomID = useAppSelector((state) => state.room.id);
    return (
    <div className="lobby-info-container">
        <h3>Info</h3>
        <ul className="info-list">
            <li>
                <span>Admin</span>
                <span>{roomAdmin.name}</span>
            </li>
            <li>
                <span>ID</span>
                <span>{roomID}</span>
            </li>
        </ul>
    </div>)
    ;
};

export default LobbyInfo;
