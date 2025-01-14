import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppSelector } from "../../../lib/util/store/hooks";
import { map } from "lodash";
import { ChangeEvent } from "react";
import { useSocketContext } from "../../../lib/util/socket/SocketProvider";
import { RoleID } from "../../../lib/util/store/roomTypes";
import UserList from "@/lib/components/lobby/UserList/UserList";

export const Route = createFileRoute("/rooms/$roomID/")({
    component: RouteComponent
});

function RouteComponent() {
    const { roomID } = Route.useParams();
    const users = useAppSelector((state) => state.room.users);
    const roles = useAppSelector((state) => state.room.roles);
    const roleAssignments = useAppSelector(
        (state) => state.room.roleAssignments
    );

    const nav = useNavigate();
    const socket = useSocketContext();

    const handleAssignRole = (
        e: ChangeEvent<HTMLSelectElement>,
        rid: RoleID
    ) => {
        e.preventDefault();
        socket.sendEvent("assignRole", rid, e.target.value);
    };

    const renderAssignments = () => {
        return map(roleAssignments, (assigned, rid) => {
            return (
                <div>
                    <label
                        htmlFor={rid}
                        style={{ color: roles[parseInt(rid)].color }}>
                        {roles[parseInt(rid)].name}
                    </label>
                    <select
                        name={rid}
                        id={rid}
                        value={assigned}
                        onChange={(e) => handleAssignRole(e, parseInt(rid))}>
                        <option value="">None</option>
                        {map(users, (user, uid) => <option value={uid}>{user.name}</option>)}
                    </select>
                    <br />
                </div>
            );
        });
    };

    return (
        <>
            <h1>Lobby</h1>
            <h2>{roomID}</h2>
            <UserList />
            {renderAssignments()}
            <button onClick={() => nav({ to: "/" })}>Home</button>
            <button onClick={() => socket.sendEvent("stageGame")}>
                Stage
            </button>
            <button
                onClick={() => {
                    socket.sendEvent("leaveRoom");
                    nav({ to: "/rooms" });
                }}>
                Leave
            </button>
        </>
    );
}
