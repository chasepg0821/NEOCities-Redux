import Logo from "@/lib/assets/images/Logo";
import { useAppSelector } from "../../../util/store/hooks"

import "./Navbar.scss"
import { useNavigate } from "@tanstack/react-router";


type Props = {}

const Navbar = (props: Props) => {
  const name = useAppSelector((state) => state.auth.name);
  const room = useAppSelector((state) => state.room.id);
  const nav = useNavigate();

  return (
    <nav className="top-nav">
      <div className="title" onClick={() => nav({ to: "/" })}>
        <Logo />
        <strong>NEO</strong>Cities
      </div>
      <div className="options">
        <div>{room === "" ? "--" : room} | {name}</div>
      </div>
    </nav>
  )
}

export default Navbar