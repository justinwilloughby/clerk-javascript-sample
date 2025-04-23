import './style.css'
import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not set')
}

const clerk = new Clerk(clerkPubKey);

window.Clerk = clerk;

await window.Clerk.load();

if (window.Clerk.user) {
  document.getElementById('app')!.innerHTML = `
    <div id="user-button"></div>
  `

  const userButtonDiv = document.getElementById('user-button')

  window.Clerk.mountUserButton(userButtonDiv as HTMLDivElement)
} else {
  document.getElementById('app')!.innerHTML = `
    <div id="sign-in"></div>
  `

  const signInDiv = document.getElementById('sign-in')

  window.Clerk.mountSignIn(signInDiv as HTMLDivElement)
}
