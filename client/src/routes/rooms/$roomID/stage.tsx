import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/rooms/$roomID/stage')({
  component: RouteComponent,
})

function RouteComponent() {
  const nav = useNavigate()

  return (
    <>
      <h1>Stage</h1>
      <button onClick={() => nav({ to: '/' })}>Home</button>
    </>
  )
}
