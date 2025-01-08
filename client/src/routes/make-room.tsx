import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAppDispatch, useAppSelector } from '../lib/util/store/hooks';
import { MVPRoom } from '../lib/MVPConstants/defaultRoom';
import { JOINED_ROOM } from '../lib/util/store/slices/roomSlice';
import { useContext } from 'react';
import { SocketContext } from '../lib/util/socket/SocketProvider';

export const Route = createFileRoute('/make-room')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useAppSelector((store) => store.auth);
  const socket = useContext(SocketContext);

  const handleMakeRoom = () => {
    //TODO: Handle REST POST call to make the room. Redirect to room/$roomID after successful REST response.
    fetch(`http://localhost:3000/api/room/make-room?uid=${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
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
      socket?.sendEvent("joinRoom", data.room);
    })
    .catch((e) => {
      console.log(e);
    })
  }

  return (
    <div>
      <h1>Make a New Room</h1>
      <p>Eventually this will be where the admin will make changes to the rules of the room and game. However for the MVP just click the button to make a new room using the default configuration.</p>
      <button onClick={handleMakeRoom}>Make Room</button>
    </div>
  )
}
