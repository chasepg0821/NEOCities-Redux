import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "../../lib/util/store/hooks";
import { JOINED_ROOM } from "../../lib/util/store/slices/roomSlice";
import { MVPRoom } from "../../lib/assets/MVPConstants/defaultRoom";
import Container from "@/lib/components/generic/Container/Container";

import "@lib/components/rooms/make.scss";
import { MdCheck } from "react-icons/md";

export const Route = createFileRoute("/rooms/make")({
    component: RouteComponent
});

function RouteComponent() {
    const user = useAppSelector((store) => store.auth);
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const handleMakeRoom = () => {
        fetch(`http://localhost:3000/api/rooms/make`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user,
                roomSetup: MVPRoom
            })
        })
            .then((res) => {
                if (!res.ok) {
                    throw Error("Response was not ok!");
                }
                return res.json();
            })
            .then((data) => {
                dispatch(JOINED_ROOM(data.room));
                nav({
                    to: "/rooms/$roomID",
                    params: {
                        roomID: data.room.id
                    }
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <Container bp="l">
            <div className="make-room-title">
                <h1>Make a New Room</h1>
                <div className="controls">
                    <button className="action" onClick={handleMakeRoom}>
                        <MdCheck />
                        Make Room
                    </button>
                </div>
            </div>
            <div className="make-details">
                <p>
                    Eventually this will be where the admin will make changes to the
                    rules of the room and game. However for the MVP just click the
                    button to make a new room using the default configuration.
                </p>
                <pre>
                    {JSON.stringify(MVPRoom, null, 4)}
                </pre>

            </div>
        </Container>
    );
}
