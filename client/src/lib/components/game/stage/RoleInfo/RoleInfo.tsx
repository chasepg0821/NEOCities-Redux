import Card from '@/lib/components/generic/Card/Card';
import { useAppSelector } from '@/lib/util/store/hooks'
import React from 'react'
import { MdAssignmentInd } from 'react-icons/md';

type Props = {}

const RoleInfo = (props: Props) => {
    const userRole = useAppSelector((state) => state.game.roles[state.game.players[state.auth.id]?.role]);

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