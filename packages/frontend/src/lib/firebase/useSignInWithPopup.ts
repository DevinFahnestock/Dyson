
import { useState } from "react"

import { AuthProvider, signInWithPopup as firebaseSignInWithPopup, User } from "firebase/auth"

import useAuthentication from "./useAuthentication"

const useSignInWithPopup = (provider: AuthProvider) => {
  const auth = useAuthentication()

  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const signInWithPopup = async () => {


    try {
      if (auth) {
      setLoading(true)
      setUser((await firebaseSignInWithPopup(auth, provider)).user)
      }
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
