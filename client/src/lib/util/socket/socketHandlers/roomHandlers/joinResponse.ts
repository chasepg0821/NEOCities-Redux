import { useNavigate, UseNavigateResult } from "@tanstack/react-router"

export const joinResponse = (nav: UseNavigateResult<string>, success: boolean, room: string, reason?: string) => {
    if (success) {
        nav({ to: `/room/${room}/` })
    } else if (reason) {
        alert(reason)
    }
}