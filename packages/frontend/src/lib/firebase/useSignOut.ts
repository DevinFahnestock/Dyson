import useAuthentication from './useAuthentication'
import { signOut as firebaseSignOut } from 'firebase/auth'
import usePlanets from '../hooks/usePlanets'
import useToken from '../hooks/useToken'
import useWarehouse from '../hooks/useWarehouse'

const useSignOut = () => {
  const auth = useAuthentication()
  const { clearPlanets } = usePlanets()
  const { clearToken } = useToken()
  const { clearWarehouse } = useWarehouse()

  const signOut = () => {
    if (!auth) {
      return
    }
    firebaseSignOut(auth)
      .then(() => {
        console.log('signed out')
        // clear all previous data
        clearPlanets()
        clearToken()
        clearWarehouse()
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return signOut
}

export default useSignOut
