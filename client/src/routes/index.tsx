import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const nav = useNavigate();

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <button onClick={() => nav({ to: "/rooms" })}>Browse Rooms</button>
      <button onClick={() => nav({ to: "/rooms/make" })}>Make Room</button>
    </div>
  )
}
