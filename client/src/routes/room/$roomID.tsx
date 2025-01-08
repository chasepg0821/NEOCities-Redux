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

    return <Outlet />
}
