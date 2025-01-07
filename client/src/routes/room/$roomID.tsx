import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SocketContext, SocketProvider } from '../../lib/util/socket/SocketProvider';
import { useContext, useEffect } from 'react';
import { useAppSelector } from '../../lib/util/store/hooks';

export const Route = createFileRoute('/room/$roomID')({
  component: RouteComponent,
})

function RouteComponent() {
    const { roomID } = Route.useParams();
    const uid = useAppSelector((state) => state.auth.id);
    const socket = useContext(SocketContext);

    useEffect(() => {
      socket?.addListener("joinResponse", (success, reason?) => {
        console.log("joined room", success, reason);
        fetch(`http://localhost:3000/api/room/${roomID}?uid=${uid}`).then((res) => res.json()).then((data) => console.log(data)).catch((e) => console.log(e));
      });

      socket?.sendEvent("joinRoom", roomID);

      return () => {
        socket?.removeListener("joinResponse");
        socket?.sendEvent("leaveRoom");
      }
    }, [])

    return <Outlet />
}
