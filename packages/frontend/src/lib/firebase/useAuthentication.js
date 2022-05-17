import { useContext } from 'react'
import { AuthenticationContext } from './authenticationProvider'


const useAuthentication = () => {
  return useContext(AuthenticationContext)
}

export default useAuthentication