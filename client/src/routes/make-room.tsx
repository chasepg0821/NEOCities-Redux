import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from '../lib/util/store/hooks'

export const Route = createFileRoute('/make-room')({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useAppSelector((store) => store.auth);

  const handleMakeRoom = () => {
    //TODO: Handle REST POST call to make the room. Redirect to room/$roomID after successful REST response.
    fetch("http://localhost:3000/api/room/make-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user
      })
    })
    .then((res) => {
      if (!res.ok) {
        throw Error("Response was not ok!");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
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
