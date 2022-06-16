import { onAuthStateChanged, User } from 'firebase/auth'
import { useState, useEffect } from 'react'

import useAuthentication from './useAuthentication'

const useUser = () => {

    const [ user, setUser ] = useState<User | null>(null)

    const auth = useAuthentication()

    useEffect(() => {
        if (!auth) { return }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
        })

        return unsubscribe

    }, [user, auth])

  return user 
}

export default useUser