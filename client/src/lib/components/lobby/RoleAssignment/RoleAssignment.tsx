import { useAppSelector } from "@/lib/util/store/hooks";

import "./RoleAssignment.scss";
import { map } from "lodash";
import { ChangeEvent } from "react";
import { RoleID } from "@/lib/util/store/roomTypes";
import { useSocketContext } from "@/lib/util/socket/SocketProvider";
import Card from "../../generic/Card/Card";
import { MdAssignmentInd } from "react-icons/md";

type Props = {};

const RoleAssignment = (props: Props) => {
    const admin = useAppSelector((state) => state.room.admin.id);
    const user = useAppSelector((state) => state.auth.id);
    const roleAssignments = useAppSelector((state) => state.room.roleAssignments);
    const roles = useAppSelector((state) => state.room.roles);
    const users = useAppSelector((state) => state.room.users);

    const socket = useSocketContext();

    const handleAssignRole = (
        e: ChangeEvent<HTMLSelectElement>,
        rid: RoleID
    ) => {
        e.preventDefault();
        socket.sendEvent("assignRole", rid, e.target.value);
    };

    return (
        <Card
            title="Roles"
            icon={<MdAssignmentInd />}
        >
            <div className="role-assignment-content">
                {map(roleAssignments, (assigned, rid) => {
                    return (
                        <div className="selector-pair" key={rid + assigned}>
                            <label
                                htmlFor={rid}
                                style={{ color: roles[parseInt(rid)].color }}>
                                {roles[parseInt(rid)].name}
                            </label>
                            <select
                                name={rid}
                                id={rid}
                                value={assigned}
                                disabled={user !== admin}
                                onChange={(e) =>
                                    handleAssignRole(e, parseInt(rid))
                                }>
                                <option value="">None</option>
                                {map(users, (user, uid) => (
                                    <option value={uid} key={rid + uid}>{user.name}</option>
                                ))}
                            </select>
                            <br />
                        </div>
                    );
                })}
            </div>

        </Card>
    );
};

export default RoleAssignment;
