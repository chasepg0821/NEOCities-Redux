import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAppSelector } from '../../../lib/util/store/hooks';
import { map } from 'lodash';
import { ChangeEvent, useContext, useMemo } from 'react';
import { SocketContext } from '../../../lib/util/socket/SocketProvider';
import { RoleID } from '../../../lib/util/store/roomTypes';

export const Route = createFileRoute('/room/$roomID/')({
  component: RouteComponent,
})

function RouteComponent() {
    const { roomID } = Route.useParams();
    const admin = useAppSelector((state) => state.room.admin);
    const users = useAppSelector((state) => state.room.users);
    const roles = useAppSelector((state) => state.room.roles);
    const roleAssignments = useAppSelector((state) => state.room.roleAssignments);
    
    const nav = useNavigate();
    const socket = useContext(SocketContext);

    const userSelectOptions = useMemo(() => {
      return map(users, (user, uid) => {
        if (uid !== admin && !Object.values(roleAssignments).includes(uid)) {
          return <option value={uid}>{user.name}</option>
        }
      });
    }, [users]);

    const renderUsers = () => {
      return (
        <ul>
          {map(users, (user, _) => <li>{user.name} | {user.latency}ms</li>)}
        </ul>
      );
    };

    const handleAssignRole = (e: ChangeEvent<HTMLSelectElement>, rid: RoleID) => {
      e.preventDefault();
      socket?.sendEvent("assignRole", rid, e.target.value);
    }

    const renderAssignments = useMemo(() => {
      return map(roleAssignments, (_, rid) => {
        return (
          <div>
            <label htmlFor={rid} style={{ color: roles[parseInt(rid)].color }}>{roles[parseInt(rid)].name}</label>
            <select name={rid} id={rid} value={roleAssignments[parseInt(rid)]} onChange={(e) => handleAssignRole(e, parseInt(rid))}>
              <option value="">None</option>
              {userSelectOptions}
            </select>
            <br />
          </div>
        )
      });
    }, [roleAssignments]);

    return (
        <>
        <h1>Lobby</h1>
        {renderUsers()}
        {renderAssignments}
        <button onClick={() => nav({ to: "/" })}>Home</button>
        <button onClick={() => nav({ to: `/room/${roomID}/stage` })}>Stage</button>
        <button onClick={() => {
          socket?.sendEvent("leaveRoom")
          nav({ to: "/"});
          }}>Leave</button>
        </>
    )
}
