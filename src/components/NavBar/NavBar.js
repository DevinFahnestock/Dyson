import React from "react"
import "./styles.css"

import { useSignInWithGoogle, useUser, useSignOut } from "../../lib/firebase"

const NavBar = () => {
  const user = useUser()
  const signOut = useSignOut()

  const { signInWithPopup, loading, error } = useSignInWithGoogle()

  return (
    <div className="container">
      <nav>
        <a href="/">
          <h1>Dyson</h1>
        </a>
        {!user && (
          <a className="SignInButton" onClick={() => signInWithPopup()}>
            Sign in
          </a>
        )}
        {user && (
          <div className="profile">
            <div className="profile name">
              {user.displayName}
              <a onClick={() => signOut()}>Sign out</a>
            </div>
            <img src={user.photoURL} alt="Profile" />
          </div>
        )}
      </nav>
    </div>
  )
}

export default NavBar
