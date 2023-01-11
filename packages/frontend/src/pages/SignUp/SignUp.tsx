import React, { useRef, useState } from 'react'
import './styles.css'

import { useAuthentication, useSignInWithGoogle } from 'src/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from 'firebase/auth'
import useToken from 'src/lib/hooks/useToken'

import validator from 'validator'

const SignUp = () => {
  const { signInWithPopup } = useSignInWithGoogle()

  let newAccount = useRef<{
    displayName: string
    email: string
    password: string
    passwordVerify: string
    phone: string
  }>({ displayName: '', email: '', password: '', passwordVerify: '', phone: '' })

  const [error, setError] = useState<String>()

  let navigate = useNavigate()
  const auth = useAuthentication()
  const { updateToken }: any = useToken()

  async function verifyCreation() {
    if (!auth) {
      setError('Error with authentification Provider, please contact the server administrator')
      return
    }
    if (!validateInput(newAccount.current, setError)) {
      return
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newAccount.current.email,
      newAccount.current.password
    ).catch((error) => {
      setError(error)
    })

    // set the new display name for the newly created user
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: newAccount.current.displayName,
      })

      // new user is now logged in and updated, Now set the ID token to the newly generated token
      await updateToken(await auth.currentUser.getIdToken())
      console.log('account created successfully', userCredential)
      navigate('/')
    }
  }

  return (
    <div className='SignupForm'>
      Create a new Account
      <div className='Signuptype'>
        <div className='group'>
          <input
            type='text'
            id='username'
            onChange={(e) => {
              newAccount.current['displayName'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
          <label>Username</label>
        </div>
        <div className='group'>
          <input
            type='password'
            id='password'
            onChange={(e) => {
              newAccount.current['password'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
          <label>Password</label>
        </div>
        <div className='group'>
          <input
            type='password'
            id='passwordVerify'
            onChange={(e) => {
              newAccount.current['passwordVerify'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
          <label>Verify Password</label>
        </div>
        <div className='group'>
          <input
            type='text'
            id='email'
            onChange={(e) => {
              newAccount.current['email'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
          <label>Email</label>
        </div>
        <div className='group'>
          <input
            type='text'
            id='phone'
            onChange={(e) => {
              newAccount.current['phone'] = e.target.value
            }}
          />
          <span className='highlight' />
          <span className='bar' />
          <label>Phone Number</label>
        </div>
        <button type='submit' onClick={() => verifyCreation()}>
          Create my Account
        </button>
      </div>
      <div className='Signuptype'>
        <button type='button' onClick={() => signInWithPopup()}>
          Sign in With Google
        </button>
      </div>
      {error}
    </div>
  )
}

export default SignUp

function validateInput(account: any, setError: (error: string) => void): boolean {
  if (!validator.isLength(account.displayName, { min: 5 })) {
    setError('Username must be at least 5 characters long')
    return false
  }

  if (account.password !== account.passwordVerify) {
    setError('Passwords do not match!')
    return false
  }

  if (!validator.isStrongPassword(account.password)) {
    setError('Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 symbol')
    return false
  }

  if (!validator.isEmail(account.email)) {
    setError('Please enter a valid email')
    return false
  }

  return true
}
