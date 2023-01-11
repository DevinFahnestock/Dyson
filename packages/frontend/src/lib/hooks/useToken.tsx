import React, { useContext, useState, useCallback, useEffect } from 'react'
import { useUser } from '../firebase'

export const TokenContext = React.createContext<any>({})

export type TokenApi = {
  token: string
  clearToken: () => void
  updateToken: (token: string) => void
}

export const TokenProvider = ({ children }: any) => {
  const [token, setToken] = useState('')

  const user = useUser()

  useEffect(() => {
    user?.getIdToken().then((token) => {
      setToken(token)
    })
  }, [user])

  const clearToken = useCallback(() => {
    setToken('')
  }, [setToken])

  const updateToken = useCallback(
    (token: string) => {
      setToken(token)
    },
    [setToken]
  )

  const tokenApi: TokenApi = {
    token,
    clearToken,
    updateToken,
  }

  return <TokenContext.Provider value={tokenApi}>{children}</TokenContext.Provider>
}

export const useToken = () => {
  return useContext(TokenContext)
}

export default useToken
