import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/room/$roomID')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/room/$roomID"!</div>
}
