import { createFileRoute, Outlet } from "@tanstack/react-router";
import { GameProvider } from "../../../lib/components/game/GameProvider";

export const Route = createFileRoute("/rooms/$roomID/game")({
    component: RouteComponent
});

function RouteComponent() {
    const { roomID } = Route.useParams();
    const user = Route.useRouteContext().user.id;

    return (
        <GameProvider user={user} room={roomID}>
            <Outlet />
        </GameProvider>
    );
}
