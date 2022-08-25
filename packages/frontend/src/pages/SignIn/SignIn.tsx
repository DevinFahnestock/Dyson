import React from 'react'
import { useSignInWithGoogle } from 'src/lib/firebase'
import './styles.css'

const SignIn = () => {
  const { signInWithPopup } = useSignInWithGoogle()
  return (
    <div className='SigninForm'>
      SignIn
      <button onClick={() => signInWithPopup()}>Sign In With Google</button>
    </div>
  )
}

export default SignIn
