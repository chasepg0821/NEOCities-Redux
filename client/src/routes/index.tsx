import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SocketContext } from '../lib/util/socket/SocketProvider'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const socket = React.useContext(SocketContext);
  const nav = useNavigate();
  const [room, setRoom] = React.useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setRoom(e.target.value);
  }

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <input value={room} onChange={handleChange}/>
      <button onClick={() => socket?.sendEvent("joinRoom", room)}>Join Room</button>
      <button onClick={() => nav({ to: "/make-room" })}>Make Room</button>
    </div>
  )
}
