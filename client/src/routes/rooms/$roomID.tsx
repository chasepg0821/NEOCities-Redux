import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { SocketProvider } from '../../lib/util/socket/SocketProvider'
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../lib/util/store/hooks';

export const Route = createFileRoute('/rooms/$roomID')({
  component: RouteComponent,
})

function RouteComponent() {
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const room = useAppSelector((state) => state.room.id);

  useEffect(() => {
    if (!room) {
      nav({ to: "/rooms", replace: true });
    } else {
      setLoading(false);
    }
  }, [room])

  return (
      !loading && 
      <SocketProvider>
        <Outlet />
      </SocketProvider>
  );
}
