import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from '../../../lib/util/store/hooks'
import { useEffect } from 'react';
import { STAGED_GAME } from '../../../lib/util/store/slices/gameSlice';

export const Route = createFileRoute('/rooms/$roomID/stage')({
  component: RouteComponent,
})

function RouteComponent() {
  const { roomID } = Route.useParams();
  const user = useAppSelector((state) => state.auth);
  const game = useAppSelector((state) => state.game);
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch(`http://localhost:3000/api/rooms/${roomID}/game?uid=${user.id}`)
    .then((res) => {
      if (!res.ok) {
        throw Error('Response was not ok!')
      }
      return res.json()
    })
    .then((data) => dispatch(STAGED_GAME(data.game)))
    .catch((e) => {
      console.log(e)
    })
  }, [])

  return (
    <>
      <h1>Stage</h1>
      <p>{JSON.stringify(game)}</p>
      <button onClick={() => nav({ to: '/' })}>Home</button>
    </>
  )
}
