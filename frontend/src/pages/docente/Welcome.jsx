import React from 'react'
import { styles } from '../../assets/styles/global-styles'
import { useAuth } from '../../context/auth-context'

const WelcomeDocente = () => {
    const {user} = useAuth();
  return (
    <>
      <div className='w-full h-lvh sm:p-10 sm:px-20 p-5'>
        <div
          className="rounded-md border-green-800 border-2 p-10 flex flex-col gap-10"
          style={{ backgroundColor: styles.backegrounGreen }}
        >
          <p className='text-center font-bold'>BIENVENIDO</p>
          <p className='uppercase'>{user?.nombre}</p>
          <p className='uppercase'>Docente del plantel</p>
        </div>
      </div>
    </>
  )
}

export default WelcomeDocente