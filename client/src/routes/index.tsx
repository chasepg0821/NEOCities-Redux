import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const nav = useNavigate();

  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  )
}
