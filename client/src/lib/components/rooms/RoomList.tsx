import { useAppSelector } from '@/lib/util/store/hooks';
import { RoomInfoType } from '@/lib/util/store/roomTypes'
import { JOINED_ROOM } from '@/lib/util/store/slices/roomSlice';
import { useNavigate } from '@tanstack/react-router';
import React from 'react'
import { useDispatch } from 'react-redux';

import "./RoomList.scss"
import Card from '../generic/Card/Card';
import { MdLock, MdLockOpen } from 'react-icons/md';

interface RoomCardProps {
  room: RoomInfoType,
  onJoin: () => void;
}

const RoomCard = ({ room, onJoin }: RoomCardProps): React.ReactNode => {
  return (
    <Card
      key={room.id}
      icon={room.locked && <MdLock />}
      title={room.id}
      actions={[
        <button className="action" onClick={onJoin}>Join Room</button>
      ]}
    >
      {room.admin.name} | {room.numUsers}
    </Card>
  )
}

interface RoomListProps {
  rooms: RoomInfoType[],
}

const RoomList = ({ rooms }: RoomListProps) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const user = useAppSelector((state) => state.auth);

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

  return (
    <div className="room-list">
      {rooms.map((room) => <RoomCard key={room.id} room={room} onJoin={() => handleJoinRoom(room.id)} />)}
    </div>
  )
}

export default RoomList