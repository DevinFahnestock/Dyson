import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignInWithGoogle } from 'src/lib/firebase'
import './styles.css'

const SignIn = () => {
  const navigate = useNavigate()
  const { signInWithPopup } = useSignInWithGoogle()
  return (
    <div className='SigninForm'>
      SignIn
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
  )
}

export default SignIn
