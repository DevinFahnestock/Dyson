import React, { createContext } from 'react'

export const AuthenticationContext = createContext(null)

const AuthenticationProvider = ({ value, children }) => {
  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  )
}

export default AuthenticationProvider