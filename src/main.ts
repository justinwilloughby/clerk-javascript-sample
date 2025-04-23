import './style.css'
import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not set')
}

declare global {
  interface Window {
    Clerk?: Clerk;
  }
}

const clerk = new Clerk(clerkPubKey, {
  domain: "securitysaas.xyz", // Satellite domain. Must register in Clerk dashboard.
});

window.Clerk = clerk;

(async function initializeClerk() {
  await window.Clerk?.load({
    isSatellite: true,
    signInUrl: "https://justinwilloughby.dev", // Primary domain sign in page.
  });
  
  // If user is signed in, show user button.
  if (clerk.user) {
    document.getElementById('app')!.innerHTML = `
      <div id="user-button"></div>
    `
    
    const userButtonDiv = document.getElementById('user-button')
    
    clerk.mountUserButton(userButtonDiv as HTMLDivElement)
  } else {
    // If user is not signed in, show sign in button that handles redirect to primary domain.
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
