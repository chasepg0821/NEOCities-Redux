import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/room/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <input type='text' value="hi"/>
    </>
  )
}
