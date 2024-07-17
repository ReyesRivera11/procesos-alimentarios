import React from 'react'
import { styles } from '../../assets/styles/global-styles'
import { useAuth } from '../../context/auth-context'

const WelcomeAdmin = () => {
  const {user} = useAuth();
  return (
    <>
      <div className='w-full h-lvh sm:p-10 sm:px-20 p-5'>
        <div
          className="rounded-md shadow-lg shadow-gray-400 border-2 p-10 flex flex-col gap-10 bg-gray-200 max-w-[800px] max-h-[300px] m-auto font-bold"
        >
          <p className='text-center font-bold'>BIENVENIDO</p>
          <p className='uppercase'>{user?.nombre} {user?.apellidos}</p>
          <p className='uppercase'>Administrador de inventarios.</p>
        </div>
      </div>
    </>
  )
}

export default WelcomeAdmin