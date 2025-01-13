import React, { PropsWithChildren } from 'react'
import Navbar from '@lib/components/Layout/Navbar/Navbar'
import Footer from './Footer/Footer'

import "./Layout.scss"

const Layout = ({children}: PropsWithChildren) => {
  return (
    <div className="layout-container">
        <Navbar />
        <main>
            {children}
        </main>
        <Footer />
    </div>
  )
}

export default Layout