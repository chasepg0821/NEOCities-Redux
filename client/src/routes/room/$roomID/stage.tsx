import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/room/$roomID/stage')({
  component: RouteComponent,
})

function RouteComponent() {
  const nav = useNavigate();

  return (
    <>
    <h1>Stage</h1>
    <button onClick={() => nav({ to: "/" })}>Home</button>
    <button onClick={() => nav({ to: "/room/oild/" })}>Lobby</button>
    </>
)
}
