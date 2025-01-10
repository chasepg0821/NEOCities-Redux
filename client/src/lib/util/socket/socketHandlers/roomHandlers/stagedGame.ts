import { UseNavigateResult } from "@tanstack/react-router";

export const stagedGame = (nav: UseNavigateResult<string>, room: string) => {
    nav({
        to: '/rooms/$roomID/stage',
        params: {
            roomID: room
        }
    })
}