import { useState } from 'react'

import { AuthProvider, signInWithPopup as firebaseSignInWithPopup } from 'firebase/auth'

import useAuthentication from './useAuthentication'
import useSocket from '../hooks/useSocket'
import { checkUserExists } from '../Networking/SocketEmitter'

const useSignInWithPopup = (provider: AuthProvider) => {
  const auth = useAuthentication()

  const { socket } = useSocket()

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const signInWithPopup = async () => {
    if (auth) {
      try {
        setLoading(true)
        const result = await firebaseSignInWithPopup(auth, provider)
        const token = await result.user.getIdToken()
        await VerifyAndCreateUserDatabaseEntry(socket, result.user.uid, token)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
  }

  return {
    error,
    loading,
    signInWithPopup,
  }
}

export default useSignInWithPopup

async function VerifyAndCreateUserDatabaseEntry(socket: any, userID: string, token: string) {
  await Promise.resolve(await checkUserExists(socket, userID, token))
    .then((isExistingAccount) => {
      if (!isExistingAccount) {
        // create a new user database entry
        console.log('User Doesnt Exist. Creating a new user entry in database')
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
