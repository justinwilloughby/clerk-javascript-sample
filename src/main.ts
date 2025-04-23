import './style.css'
import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not set')
}

// Properly declare the Clerk type in the Window interface
declare global {
  interface Window {
    Clerk?: Clerk;
  }
}

const clerk = new Clerk(clerkPubKey, {
  domain: "securitysaas.xyz",
});

window.Clerk = clerk;

// Wrap async code in a function instead of using top-level await
(async function initializeClerk() {
  await window.Clerk?.load({
    isSatellite: true,
    signInUrl: "https://justinwilloughby.dev",
  });
  
  if (clerk.user) {
    document.getElementById('app')!.innerHTML = `
      <div id="user-button"></div>
    `
    
    const userButtonDiv = document.getElementById('user-button')
    
    clerk.mountUserButton(userButtonDiv as HTMLDivElement)
  } else {
    document.getElementById('app')!.innerHTML = `
      <button id="sign-in">Sign In</button>
    `
    
    const signInButton = document.getElementById('sign-in')

    signInButton?.addEventListener('click', () => {
      clerk.redirectToSignIn();
    })    
  }
})().catch(error => {
  console.error("Failed to initialize Clerk:", error);
});
