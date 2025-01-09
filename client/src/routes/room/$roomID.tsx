import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SocketContext } from '../../lib/util/socket/SocketProvider';
import { useContext, useEffect } from 'react';

export const Route = createFileRoute('/room/$roomID')({
  component: RouteComponent,
})

function RouteComponent() {
    const socket = useContext(SocketContext);

    // useEffect(() => socket?.sendEvent('leaveRoom'), []);

    return <Outlet />
}
