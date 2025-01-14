import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppSelector } from "../../../lib/util/store/hooks";
import { map } from "lodash";
import { ChangeEvent } from "react";
import { useSocketContext } from "../../../lib/util/socket/SocketProvider";
import { RoleID } from "../../../lib/util/store/roomTypes";
import UserList from "@/lib/components/lobby/UserList/UserList";
import Container from "@/lib/components/generic/PageContainer/Container";
import LobbyInfo from "@/lib/components/lobby/LobbyInfo/LobbyInfo";
import RoleAssignment from "@/lib/components/lobby/RoleAssignment/RoleAssignment";

export const Route = createFileRoute("/rooms/$roomID/")({
    component: RouteComponent
});

function RouteComponent() {
    const nav = useNavigate();
    const socket = useSocketContext();

    return (
        <Container bp={"l"}>
            <h1>Room Lobby</h1>
            <UserList />
            <LobbyInfo />
            <RoleAssignment />
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
        </Container>
    );
}
