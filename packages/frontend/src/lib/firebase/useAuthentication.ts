import { Auth } from 'firebase/auth'
import { useContext } from 'react'
import { AuthenticationContext } from './authenticationProvider'

const useAuthentication = (): Auth | null => {
  return useContext(AuthenticationContext)
}

export default useAuthentication
