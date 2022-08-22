import React from 'react'
import { SocketEmitter } from 'src/lib/Networking/SocketEmitter'
import Signupform from './components/Signupform'

const SignUp = ({ socketEmitter }: { socketEmitter: SocketEmitter }) => {
  return (
    <div>
      <Signupform socketEmitter={socketEmitter} />
    </div>
  )
}

export default SignUp
