import { useAppSelector } from "@/lib/util/store/hooks";
import { map } from "lodash";
import { MdDownloading, MdNetworkWifi, MdNetworkWifi1Bar, MdNetworkWifi2Bar, MdPerson } from "react-icons/md";

import "./UserStage.scss";
import Card from "../../../generic/Card/Card";


const UserStage = () => {
    const users = useAppSelector((state) => state.room.users);
    return (
        <Card
            title="Users"
            icon={<MdPerson />}
            style={{
                flexGrow: 1
            }}
        >
            <ul className="user-stage">
                {map(users, (user, _) => (
                    <li key={user.name}>
                        <span>{user.name}</span>
                        <div className="user-info">
                            {user.latency}ms
                            {user.latency > 60 ? <MdNetworkWifi2Bar color="yellow" />
                                : user.latency > 100
                                    ? <MdNetworkWifi1Bar color="red" />
                                    : <MdNetworkWifi color="green" />}
                            <MdDownloading color={user.state === 'loaded' ? "green" : "lightgrey"} />
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default UserStage;
