import Card from '@/lib/components/generic/Card/Card';
import { useAppSelector } from '@/lib/util/store/hooks'
import { TaskID } from '@/lib/util/store/roomTypes';
import { map } from 'lodash';
import React from 'react'

type Props = {
    setActive?: (id: TaskID) => void;
}

const TaskList = ({ setActive }: Props) => {
    const tasks = useAppSelector((state) => state.game.tasks);
    return (
        <div>
            {
                map(tasks, (task, tid) => (
                    <Card
                        key={tid}
                        title={task.name}
                    >
                        <pre>
                            {JSON.stringify(task, null, 4)}
                        </pre>
                    </Card>
                ))
            }

        </div>
    )
}

export default TaskList