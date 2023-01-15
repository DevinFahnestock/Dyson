import { useState } from 'react'

import { AuthProvider, signInWithPopup as firebaseSignInWithPopup } from 'firebase/auth'

import useAuthentication from './useAuthentication'

const useSignInWithPopup = (provider: AuthProvider) => {
  const auth = useAuthentication()

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const signInWithPopup = async () => {
    try {
      if (auth) {
        setLoading(true)
        await firebaseSignInWithPopup(auth, provider)
      }
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    error,
    loading,
    signInWithPopup,
  }
}

export default useSignInWithPopup
