import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SocketContext } from '../lib/util/socket/SocketProvider'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const socket = React.useContext(SocketContext)
  const navigate = useNavigate();

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <button onClick={() => navigate({ to: "/room/oild"})}>Home</button>
    </div>
  )
}
