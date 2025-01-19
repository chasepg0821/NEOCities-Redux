import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import "../styles/globals.scss"
import { StoreProvider } from '../lib/util/store/StoreProvider'
import Layout from '../lib/components/Layout/Layout'

interface RouteContext {
  user: {
    id: string,
    name: string
  }
}

export const Route = createRootRouteWithContext<RouteContext>()({
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
