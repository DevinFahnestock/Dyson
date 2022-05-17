import React from "react"

import useAuthentication from "./useAuthentication"
import { signOut as firebaseSignOut } from "firebase/auth"

const useSignOut = () => {

  const auth = useAuthentication()

  const signOut = () => {
    firebaseSignOut(auth)
      .then(() => {
        console.log("signed out")
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return signOut
}

export default useSignOut
