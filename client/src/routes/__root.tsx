import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import "../styles/globals.scss"
import { StoreProvider } from '../lib/util/store/StoreProvider'
import { SocketProvider } from '../lib/util/socket/SocketProvider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <StoreProvider>
          <Outlet />
      </StoreProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  )
}
