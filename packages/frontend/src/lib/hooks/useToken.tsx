import React, { useContext, useState, useCallback } from 'react'

export const TokenContext = React.createContext({})

export type TokenApi = {
  token: string
  clearToken: () => void
  updateToken: () => void
}

export const TokenProvider = ({ children }: any) => {
  const [token, setToken] = useState('')

  const clearToken = useCallback(() => {
    setToken('')
  }, [setToken])

  const updateToken = useCallback(
    (token: string) => {
      setToken(token)
    },
    [setToken]
  )

  const tokenApi = {
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
