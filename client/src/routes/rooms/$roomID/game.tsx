import { createFileRoute, Outlet } from "@tanstack/react-router";
import { GameProvider } from "../../../lib/components/game/GameProvider";
import { useAppSelector } from "../../../lib/util/store/hooks";

export const Route = createFileRoute("/rooms/$roomID/game")({
    component: RouteComponent
});

function RouteComponent() {
    const { roomID } = Route.useParams();
    const user = useAppSelector((state) => state.auth.id);

    return (
        <GameProvider user={user} room={roomID}>
            <Outlet />
        </GameProvider>
    );
}
