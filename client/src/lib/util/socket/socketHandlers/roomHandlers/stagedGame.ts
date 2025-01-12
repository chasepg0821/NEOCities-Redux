import { UseNavigateResult } from "@tanstack/react-router";

export const stagedGame = (nav: UseNavigateResult<string>, room: string) => {
    nav({
        to: '/rooms/$roomID/game',
        params: {
            roomID: room
        }
    })
}