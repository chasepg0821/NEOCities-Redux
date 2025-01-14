import { useAppSelector } from '@/lib/util/store/hooks';
import { map } from 'lodash';

import "./UserList.scss"

const UserList = () => {
    const users = useAppSelector((state) => state.room.users);
    return (
        <ul className="user-list">
            {map(users, (user, _) => (
                <li>
                    <span>{user.name}</span>
                    <div className="user-latency">
                        {user.latency}ms
                        <div className="indicator" style={{
                            backgroundColor: user.latency > 60 ? "yellow" : user.latency > 100 ? "red" : "green"
                        }}/>
                    </div>
                </li>
            ))}
        </ul>

    )
}

export default UserList