import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rooms/$roomID/game/play')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/rooms/$roomID/game/play"!</div>
}
