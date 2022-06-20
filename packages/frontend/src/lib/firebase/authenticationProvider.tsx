import { Auth } from 'firebase/auth'
import React, { createContext } from 'react'

export const AuthenticationContext = createContext<Auth | null>(null)

const AuthenticationProvider = ({ value, children }: { value: Auth; children: JSX.Element | JSX.Element[] }) => {
  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>
}

export default AuthenticationProvider
