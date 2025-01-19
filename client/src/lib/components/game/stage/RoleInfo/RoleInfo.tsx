import Card from '@/lib/components/generic/Card/Card';
import { useAppSelector } from '@/lib/util/store/hooks'
import { useRouteContext } from '@tanstack/react-router';
import React from 'react'
import { MdAssignmentInd } from 'react-icons/md';

type Props = {}

const RoleInfo = (props: Props) => {
    const userID = useRouteContext({ from: "/rooms/$roomID/game/" }).user.id;
    const userRole = useAppSelector((state) => state.game.roles[state.game.players[userID]?.role]);

    return (
        <Card
            title="Role Info"
            icon={<MdAssignmentInd />}
        >
            <pre>
                {userRole && JSON.stringify(userRole, null, 4)}
            </pre>
        </Card>
    )
}

export default RoleInfo