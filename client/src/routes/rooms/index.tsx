import { createFileRoute } from '@tanstack/react-router'
import RoomList from '@/lib/components/rooms/RoomList'
import Container from '@/lib/components/generic/Container/Container'

export const Route = createFileRoute('/rooms/')({
  component: RouteComponent,
  loader: async () => {
    const rooms =  await fetch(`http://localhost:3000/api/rooms/`)
      .then((res) => {
        if (!res.ok) {
          throw Error('Response was not ok!')
        }
        return res.json()
      })
      .then((data) => data.rooms)
      .catch((e) => {
        console.log(e)
      })

    return {
      rooms
    }
  }
})



function RouteComponent() {
  const { rooms } = Route.useLoaderData();

  return (
    <Container bp={"l"}>
      <h1>Join a Room</h1>
      {rooms && <RoomList rooms={rooms} />}
    </Container>
  )
}

