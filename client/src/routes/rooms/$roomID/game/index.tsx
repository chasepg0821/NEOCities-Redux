import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useGameContext } from "../../../../lib/components/game/GameProvider";
import { useAppSelector } from "../../../../lib/util/store/hooks";

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
            <p>
                {!loading && (
                    <pre style={{ lineHeight: 1 }}>
                        {JSON.stringify(
                            GameContext.getGameData((gD) => gD.roles[gD.players[user].role]) || {},
                            null,
                            4
                        )}
                    </pre>
                )}
            </p>
            <button onClick={() => nav({ to: "/" })}>Home</button>
        </>
    );
}
