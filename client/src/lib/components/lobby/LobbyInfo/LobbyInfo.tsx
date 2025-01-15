import { useAppSelector } from "@/lib/util/store/hooks";

import "./LobbyInfo.scss";
import { map } from "lodash";
import Card from "../../generic/Card/Card";
import { MdInfo } from "react-icons/md";

type Props = {};

const LobbyInfo = (props: Props) => {
    const roomAdmin = useAppSelector((state) => state.room.admin);
    const roomID = useAppSelector((state) => state.room.id);

    return (
        <Card
            title="Info"
            icon={<MdInfo />}
        >
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
        </Card>
    );
};

export default LobbyInfo;
