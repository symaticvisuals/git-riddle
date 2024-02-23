import { SignIn } from '@clerk/nextjs'
import React from 'react'


function LoginPage() {
  return (
    <div className='h-screen flex justify-center items-center'>
      <SignIn signUpUrl='/signup' afterSignInUrl={'/'} redirectUrl={'/'} 
      />
    </div>
  )
}

export default LoginPage
