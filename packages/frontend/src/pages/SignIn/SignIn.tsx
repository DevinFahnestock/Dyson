import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthentication, useSignInWithGoogle } from 'src/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import './styles.css'

const SignIn = () => {
  const navigate = useNavigate()
  const { signInWithPopup } = useSignInWithGoogle()
  const auth = useAuthentication()
  let acc = useRef<{ email: string; password: string }>({ email: '', password: '' })
  const [error, setError] = useState<String>()

  const trySignIn = () => {
    if (!auth) {
      setError('Error with authentification Provider, please contact the server administrator')
      return
    }

    signInWithEmailAndPassword(auth, acc.current.email, acc.current.password)
      .then(() => {
        console.log('successfully logged in')
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
              acc.current['email'] = e.target.value
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
              acc.current['password'] = e.target.value
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
