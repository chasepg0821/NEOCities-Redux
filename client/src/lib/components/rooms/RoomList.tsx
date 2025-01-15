import { useAppSelector } from '@/lib/util/store/hooks';
import { RoomInfoType } from '@/lib/util/store/roomTypes'
import { JOINED_ROOM } from '@/lib/util/store/slices/roomSlice';
import { ReactNode, useNavigate } from '@tanstack/react-router';
import React, { ReactElement } from 'react'
import { useDispatch } from 'react-redux';

import "./RoomList.scss"

interface RoomCardProps {
    room: RoomInfoType,
    onJoin: () => void;
}

const RoomCard = ({room, onJoin}: RoomCardProps): React.ReactNode => {
    return (
        <div className="room-card">
            <div className='card-title'>
                <h3 className="id">{room.id}</h3>
                <button className="action" onClick={onJoin}>Join Room</button>
            </div>
            <div className='card-body'>
                {room.admin.name} | {room.numUsers}
            </div>            
        </div>        
    )
} 

interface RoomListProps {
    rooms: RoomInfoType[],
}

const RoomList = ({rooms}: RoomListProps) => {
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