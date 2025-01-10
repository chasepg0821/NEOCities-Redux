import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppSelector } from "../../../lib/util/store/hooks";
import { map } from "lodash";
import { ChangeEvent, useCallback, useContext, useMemo } from "react";
import { SocketContext } from "../../../lib/util/socket/SocketProvider";
import { RoleID } from "../../../lib/util/store/roomTypes";

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
    const socket = useContext(SocketContext);

    const handleAssignRole = (
        e: ChangeEvent<HTMLSelectElement>,
        rid: RoleID
    ) => {
        e.preventDefault();
        socket?.sendEvent("assignRole", rid, e.target.value);
    };

    const renderUserList = useMemo(() => {
        return (
            <ul>
                {map(users, (user, _) => (
                    <li>
                        {user.name} | {user.latency}ms
                    </li>
                ))}
            </ul>
        );
    }, [users]);

    const userInfo = useMemo(() => {
        return map(users, (user, id) => ({
            id,
            name: user.name
        }));
    }, [users]);

    const renderAssignments = useMemo(() => {
        return map(roleAssignments, (_, rid) => {
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
                        value={roleAssignments[parseInt(rid)]}
                        onChange={(e) => handleAssignRole(e, parseInt(rid))}>
                        <option value="">None</option>
                        {map(userInfo, (uI) => <option value={uI.id}>{uI.name}</option>)}
                    </select>
                    <br />
                </div>
            );
        });
    }, [userInfo, roleAssignments]);

    return (
        <>
            <h1>Lobby</h1>
            {renderUserList}
            {renderAssignments}
            <button onClick={() => nav({ to: "/" })}>Home</button>
            <button onClick={() => socket?.sendEvent("stageGame")}>
                Stage
            </button>
            <button
                onClick={() => {
                    socket?.sendEvent("leaveRoom");
                    nav({ to: "/rooms" });
                }}>
                Leave
            </button>
        </>
    );
}
