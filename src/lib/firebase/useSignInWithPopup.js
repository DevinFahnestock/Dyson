
import { useState } from "react"

import { signInWithPopup as firebaseSignInWithPopup } from "firebase/auth"

import useAuthentication from "./useAuthentication"

const useSignInWithPopup = (provider) => {
  const auth = useAuthentication()

  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const signInWithPopup = async () => {
    try {
      setLoading(true)
      setUser(await firebaseSignInWithPopup(auth, provider))
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    error,
    loading,
    signInWithPopup,
  }
}

export default useSignInWithPopup
