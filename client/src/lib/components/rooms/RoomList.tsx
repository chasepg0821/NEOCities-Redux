import { RoomInfoType } from '@/lib/util/store/roomTypes'
import { useNavigate } from '@tanstack/react-router';

import "./RoomList.scss"
import Card from '../generic/Card/Card';
import { MdLock } from 'react-icons/md';

interface RoomListProps {
  rooms: RoomInfoType[],
}

const RoomList = ({ rooms }: RoomListProps) => {
  const nav = useNavigate();

  return (
    <div className="room-list">
      {rooms.map((room) => (
        <Card
          key={room.id}
          icon={room.locked && <MdLock />}
          title={room.id}
          actions={[
            <button className="action" onClick={() => nav({ to: "/rooms/$roomID", params: { roomID: room.id }})} key={`join-button-${room.id}`}>Join Room</button>
          ]}
        >
          {room.admin.name} | {room.numUsers}
        </Card>
      ))}
    </div>
  )
}

export default RoomList