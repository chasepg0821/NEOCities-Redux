import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSocketContext } from "../../../lib/util/socket/SocketProvider";
import Container from "@/lib/components/generic/Container/Container";
import LobbyInfo from "@/lib/components/lobby/LobbyInfo/LobbyInfo";
import RoleAssignment from "@/lib/components/lobby/RoleAssignment/RoleAssignment";

import "@lib/components/lobby/lobby.scss";
import { MdCloudDone, MdLogout } from "react-icons/md";
import { useAppSelector } from "@/lib/util/store/hooks";
import UserList from "@/lib/components/lobby/UserList/UserList";

export const Route = createFileRoute("/rooms/$roomID/")({
    component: RouteComponent
});

function RouteComponent() {
    const user = Route.useRouteContext().user.id;
    const admin = useAppSelector((state) => state.room.admin.id);
    const nav = useNavigate();
    const socket = useSocketContext();

    return (
        <Container bp={"l"}>
            <div className="lobby-title">
                <h1>Room Lobby</h1>
                <div className="controls">
                    <button
                        className="leave"
                        onClick={() => {
                            socket.sendEvent("leaveRoom");
                            nav({ to: "/rooms" });
                        }}>
                        <MdLogout />
                        <span>Leave Room</span>
                    </button>
                    {user === admin && (
                        <button
                            className="action"
                            onClick={() => socket.sendEvent("stageGame")}>
                            <MdCloudDone />
                            <span>Stage Game</span>
                        </button>
                    )}
                </div>
            </div>
            <div className="lobby-details">
                <div className="left">
                    <UserList />
                </div>
                <div className="right">
                    <LobbyInfo />
                    <RoleAssignment />
                </div>
            </div>
        </Container>
    );
}
