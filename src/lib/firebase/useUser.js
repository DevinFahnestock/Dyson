import { onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'

import useAuthentication from './useAuthentication'

const useUser = () => {

    const [ user, setUser ] = useState(null)

    const auth = useAuthentication()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user)
        })
    }, [user])

  return user 
}

export default useUser