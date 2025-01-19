import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { v4 as uuidv4 } from 'uuid';

import { routeTree } from './routeTree.gen'
import { generateUserName } from '@/lib/util/usernameGenerator/usernameGenerator';

const generateNewID = (): string => {
  const id = uuidv4();
  window.sessionStorage.setItem("id", id);
  return id;
}

const generateNewName = (): string => {
  const name = generateUserName();
  window.sessionStorage.setItem("name", name);
  return name;
}

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    user: {
      id: window.sessionStorage.getItem("id") || generateNewID(),
      name: window.sessionStorage.getItem("name") || generateNewName()
    },
  }
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
