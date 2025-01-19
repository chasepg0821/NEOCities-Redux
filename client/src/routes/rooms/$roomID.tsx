import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SocketProvider } from "../../lib/util/socket/SocketProvider";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/util/store/hooks";
import { JOINED_ROOM } from "@/lib/util/store/slices/roomSlice";

export const Route = createFileRoute("/rooms/$roomID")({
    component: RouteComponent,
    beforeLoad: async ({ context, params }) => {
      return fetch(`http://localhost:3000/api/rooms/join`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              user: context.user,
              room: params.roomID
          })
      })
          .then((res) => {
              if (!res.ok) {
                  throw Error("Response was not ok!");
              }
              return res.json();
          })
          .then((data) => data)
          // TODO: handle the response codes correctly, maybe add an errorComponent
          .catch((e) => {
            console.log(e);
            throw redirect({
              to: "/rooms"
            });
          });
  },
  loader: ({context}) => {
    return context.room;
  },
  pendingComponent: () => <div>Loading...</div>,
  gcTime: 0,
  shouldReload: false
});

function RouteComponent() {
    const user = Route.useRouteContext().user;
    const room = Route.useLoaderData();
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(JOINED_ROOM(room));
    }, [room])

    return (
        <SocketProvider user={user}>
            <Outlet />
        </SocketProvider>
    );
}
