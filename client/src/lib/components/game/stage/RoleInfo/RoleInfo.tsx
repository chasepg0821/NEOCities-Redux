import { useAppSelector } from '@/lib/util/store/hooks'
import React from 'react'

type Props = {}

const RoleInfo = (props: Props) => {
    const userRole = useAppSelector((state) => state.game.roles[state.game.players[state.auth.id].role]);

    return (
        <>
            <div>RoleInfo</div>
            <pre>
                {userRole && JSON.stringify(userRole, null, 4)}
            </pre>
        </>
    )
}

export default RoleInfo