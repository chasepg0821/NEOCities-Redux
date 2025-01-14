import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import "../styles/globals.scss"
import { StoreProvider } from '../lib/util/store/StoreProvider'
import Layout from '../lib/components/Layout/Layout'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <StoreProvider>
        <Layout>
          <Outlet />
        </Layout>
      </StoreProvider>
    </>
  )
}
