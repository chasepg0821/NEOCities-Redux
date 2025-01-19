import { useAppSelector } from '@/lib/util/store/hooks';
import { RoomInfoType } from '@/lib/util/store/roomTypes'
import { JOINED_ROOM } from '@/lib/util/store/slices/roomSlice';
import { useNavigate, useRouteContext } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';

import "./RoomList.scss"
import Card from '../generic/Card/Card';
import { MdLock } from 'react-icons/md';

interface RoomListProps {
  rooms: RoomInfoType[],
}

const RoomList = ({ rooms }: RoomListProps) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const context= useRouteContext({ from: "/rooms/" });

  const handleJoinRoom = (room: string) => {
    fetch(`http://localhost:3000/api/rooms/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: context.user,
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

  return (
    <div className="room-list">
      {rooms.map((room) => (
        <Card
          key={room.id}
          icon={room.locked && <MdLock />}
          title={room.id}
          actions={[
            <button className="action" onClick={() => handleJoinRoom(room.id)} key={`join-button-${room.id}`}>Join Room</button>
          ]}
        >
          {room.admin.name} | {room.numUsers}
        </Card>
      ))}
    </div>
  )
}

export default RoomList