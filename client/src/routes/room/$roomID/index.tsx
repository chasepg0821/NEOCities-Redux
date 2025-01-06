import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { SocketProvider } from '../../../lib/util/socket/SocketProvider'

export const Route = createFileRoute('/room/$roomID/')({
  component: RouteComponent,
})

function RouteComponent() {
    const nav = useNavigate();

    return (
        <>
        <h1>Lobby</h1>
        <button onClick={() => nav({ to: "/" })}>Home</button>
        <button onClick={() => nav({ to: "/room/oild/stage" })}>Stage</button>
        <button onClick={() => nav({ to: "/room/oild/play" })}>Play</button>
        </>
    )
}
