import Logo from "@/lib/assets/images/Logo";
import { useAppSelector } from "../../../util/store/hooks";

import "./Navbar.scss";
import { useMatches, useNavigate, useRouteContext } from "@tanstack/react-router";
import { MdConstruction, MdSearch } from "react-icons/md";

type Props = {};

const Navbar = (props: Props) => {
    const matches = useMatches();
    const name = matches[matches.length -1].context.user.name;
    const room = useAppSelector((state) => state.room.id);
    const nav = useNavigate();

    return (
        <nav className="top-nav">
            <div className="title" onClick={() => nav({ to: "/" })}>
                <Logo />
                <strong>NEO</strong>Cities
            </div>
            <div className="options">
                <div>
                    {room === "" ? "--" : room} | {name}
                </div>
                <button
                    className="alternate"
                    onClick={() => nav({ to: "/rooms" })}>
                    <MdSearch />
                    <span>Browse Rooms</span>
                </button>
                <button
                    className="action"
                    onClick={() => nav({ to: "/rooms/make" })}>
                      <MdConstruction />
                    <span>Make a Room</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
