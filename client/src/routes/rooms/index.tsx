import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChangeEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../lib/util/store/hooks'
import { JOINED_ROOM } from '../../lib/util/store/slices/roomSlice'
import { RoomInfoType } from '../../lib/util/store/roomTypes'

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
  const user = useAppSelector((store) => store.auth)
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const handleJoinRoom = (room: string) => {
    fetch(`http://localhost:3000/api/rooms/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        room,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error('Response was not ok!')
        }
        return res.json()
      })
      .then((data) => {
        dispatch(JOINED_ROOM(data.room))
        nav({ 
          to: "/rooms/$roomID", 
          params: {
            roomID: data.room.id
          }
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const renderRooms = () => {
    return rooms.map((roomInfo: RoomInfoType) => {
      return (
        <div>
          <h3>{roomInfo.id}</h3>
          <p>{roomInfo.admin.name}</p>
          <button onClick={() => handleJoinRoom(roomInfo.id)}>Join</button>
        </div>
      );
    });
  }

  return (
    <div>
      {rooms && renderRooms()}
    </div>
  )
}

