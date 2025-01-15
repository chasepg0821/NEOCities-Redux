import { useAppSelector } from "@/lib/util/store/hooks";
import { map } from "lodash";
import { MdNetworkWifi, MdNetworkWifi1Bar, MdNetworkWifi2Bar, MdPerson } from "react-icons/md";

import "./UserList.scss";


const UserList = () => {
    const users = useAppSelector((state) => state.room.users);
    return (
        <div className="user-list-container">
            <h3>Users</h3>
            <ul className="user-list">
                {map(users, (user, _) => (
                    <li key={user.name}>
                        <span>{user.name}</span>
                        <div className="user-latency">
                            {user.latency}ms
                            {user.latency > 60 ? <MdNetworkWifi2Bar color="yellow"/> 
                                            : user.latency > 100
                                              ? <MdNetworkWifi1Bar color="red"/>
                                              : <MdNetworkWifi color="green"/>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
