import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useGameContext } from "../../../../lib/components/game/GameProvider";
import { useAppSelector } from "../../../../lib/util/store/hooks";
import RoleInfo from "@/lib/components/game/stage/RoleInfo/RoleInfo";
import UserStage from "@/lib/components/game/stage/UserStage/UserStage";
import Container from "@/lib/components/generic/Container/Container";
import { useSocketContext } from "@/lib/util/socket/SocketProvider";
import { forEach } from "lodash";
import { MdPlayArrow } from "react-icons/md";
import PlayerStage from "@/lib/components/game/stage/PlayerStage/PlayerStage";

export const Route = createFileRoute("/rooms/$roomID/game/")({
    component: RouteComponent
});

function RouteComponent() {
    const { roomID } = Route.useParams();
    const nav = useNavigate();
    const GameContext = useGameContext();
    const [loading, setLoading] = useState(true);
    const admin = useAppSelector((state) => state.room.admin.id);
    const user = Route.useRouteContext().user.id;
    const users = useAppSelector((state) => state.room.users);
    const players = useAppSelector((state) => state.game.players);
    const socket = useSocketContext();

    useEffect(() => {
        GameContext.fetchGameData()
            .then(() => setLoading(false))
            .catch((e) => console.log(e));
    }, []);

    const usersLoaded = useMemo(() => {
        let allLoaded = true;
        forEach(users, (u) => {
            if (!u.loaded) allLoaded = false;
        });
        return allLoaded;
    }, [users]);

    const playersReady = useMemo(() => {
        let allReady = true;
        forEach(players, (p) => {
            if (!p.ready) allReady = false;
        });
        return allReady;
    }, [players])

    return (
        <Container bp={"l"}>
            <div className="lobby-title">
                <h1>Game Stage</h1>
                <div className="controls">
                    {user !== admin && (
                        <button
                            className="leave"
                            onClick={() => {
                                socket.sendEvent("leaveRoom");
                                nav({ to: "/rooms" });
                            }}>
                            <span>Leave Room</span>
                        </button>
                    )}
                    {user === admin && (
                        <>
                            <button
                                className="leave"
                                onClick={() => {
                                    socket.sendEvent("unstageGame");
                                    nav({ to: "/rooms/$roomID", params: { roomID } });
                                }}>
                                <span>Unstage Game</span>
                            </button>
                            <button
                                className="action"
                                disabled={!(usersLoaded && playersReady)}
                                onClick={() => socket.sendEvent("startGame")}>
                                <MdPlayArrow />
                                <span>Start Game</span>
                            </button>
                        </>

                    )}
                </div>
            </div>
            <div className="lobby-details">
                <div className="left">
                    <UserStage />
                </div>
                <div className="right">
                    <PlayerStage />
                    <RoleInfo />
                </div>
            </div>
        </Container>
    );
}
