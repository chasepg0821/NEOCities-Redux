import TaskList from '@/lib/components/game/play/TaskList/TaskList'
import Container from '@/lib/components/generic/Container/Container'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rooms/$roomID/game/play')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container bp='l'>
      <TaskList />
    </Container>
  );
}
