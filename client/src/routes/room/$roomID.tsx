import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SocketContext, SocketProvider } from '../../lib/util/socket/SocketProvider';
import { useContext, useEffect } from 'react';

export const Route = createFileRoute('/room/$roomID')({
  component: RouteComponent,
})

function RouteComponent() {
    const { roomID } = Route.useParams();
    const socket = useContext(SocketContext);

    useEffect(() => {
      socket?.addListener("joinedRoom", (success, reason?) => {
        console.log("joined room", success, reason);
      });

      socket?.sendEvent("joinRoom", roomID);

      return () => {
        socket?.removeListener("joinedRoom");
        socket?.sendEvent("leaveRoom");
      }
    }, [])

    return <Outlet />
}
