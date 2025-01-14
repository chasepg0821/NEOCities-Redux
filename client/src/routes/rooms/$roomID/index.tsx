import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSocketContext } from "../../../lib/util/socket/SocketProvider";
import UserList from "@/lib/components/lobby/UserList/UserList";
import Container from "@/lib/components/generic/Container/Container";
import LobbyInfo from "@/lib/components/lobby/LobbyInfo/LobbyInfo";
import RoleAssignment from "@/lib/components/lobby/RoleAssignment/RoleAssignment";

import "@lib/components/lobby/lobby.scss"

export const Route = createFileRoute("/rooms/$roomID/")({
    component: RouteComponent
});

function RouteComponent() {
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
                        Leave Room
                    </button>
                    <button
                        className="stage"
                        onClick={() => socket.sendEvent("stageGame")}
                    >
                        Stage Game
                    </button>
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
