import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useGameContext } from "../../../../lib/components/game/GameProvider";
import { useAppSelector } from "../../../../lib/util/store/hooks";
import RoleInfo from "@/lib/components/game/stage/RoleInfo/RoleInfo";

export const Route = createFileRoute("/rooms/$roomID/game/")({
    component: RouteComponent
});

function RouteComponent() {
    const nav = useNavigate();
    const GameContext = useGameContext();
    const [loading, setLoading] = useState(true);
    const user = useAppSelector((state) => state.auth.id);

    useEffect(() => {
        GameContext.fetchGameData()
            .then(() => setLoading(false))
            .catch((e) => console.log(e));
    }, []);

    return (
        <>
            <h1>Stage</h1>
            <RoleInfo />
            <button onClick={() => nav({ to: "/" })}>Home</button>
        </>
    );
}
