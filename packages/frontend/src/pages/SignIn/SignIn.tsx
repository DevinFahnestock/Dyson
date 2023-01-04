import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthentication, useSignInWithGoogle } from 'src/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import useToken from 'src/lib/hooks/useToken'

import './styles.css'

const SignIn = () => {
  const navigate = useNavigate()

  const { signInWithPopup } = useSignInWithGoogle()

  const auth = useAuthentication()
  const { updateToken }: any = useToken()

  let account = useRef<{ email: string; password: string }>({ email: '', password: '' })
  const [error, setError] = useState<String>()

  const trySignIn = () => {
    if (!auth) {
      setError('Error with authentification Provider, please contact the server administrator')
      return
    }

    signInWithEmailAndPassword(auth, account.current.email, account.current.password)
      .then(async (userCredential) => {
        console.log('successfully logged in')
        await updateToken(await userCredential.user.getIdToken())
        navigate('/')
      })
      .catch(() => console.table(error))
  }

  return (
    <div className='SigninForm'>
      SignIn
      <div className='signintype'>
        <div className='group'>
          <input
            type='text'
            id='email'
            onChange={(e) => {
              account.current['email'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
          <label>Email</label>
        </div>
        <div className='group'>
          <input
            type='password'
            id='password'
            onChange={(e) => {
              account.current['password'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
          <label>Password</label>
        </div>
        <button type='submit' onClick={() => trySignIn()}>
          Sign In
        </button>
      </div>
      <div className='signintype'>
        <button
          onClick={() => {
            signInWithPopup().then(() => {
              console.log('successfully logged in')
              navigate('/')
            })
          }}
        >
          Sign In With Google
        </button>
      </div>
    </div>
  )
}

export default SignIn
