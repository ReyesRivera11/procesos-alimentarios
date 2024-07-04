import React, { useState } from 'react';
import { styles } from '../assets/styles/global-styles'
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import { Input } from "@nextui-org/react";
import { useForm } from "react-hook-form"
import { IoEye, IoEyeOff } from "react-icons/io5";
const Home = () => {
  const { backegrounGreen } = styles;
  const { register, formState: { errors }, handleSubmit, } = useForm();
  const { error, loginAlumno } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const navigate = useNavigate();
  const onSubmit = handleSubmit(async (values) => {
    const res = await loginAlumno(values);
    if (res) {
      res.role === "alumno" && navigate("/inicio");
      res.role === "admin" && navigate("/inicio-admin");
    }
  });

  return (
    <div className='flex justify-center items-center h-full mt-20'>
      <div className=" border-[2px] p-10 shadow-2xl rounded-md">
        <div className="">
          <p className='text-xl font-bold'>Iniciar sesión</p>
          <p className='text-gray-400 font-semibold'>Ingresa tu usuario y contraseña para iniciar sesión.</p>
          {
            error.length > 0 && (
              <p className='text-center mt-2 text-red-600'>{error}</p>
            )
          }
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-5 my-5">
          <Input
            type="text"
            label="Usuario"
            variant='flat'
            errorMessage={errors?.username?.message}
            isInvalid={errors.username ? true : false}
            {
            ...register("username", {
              required: {
                value: true,
                message: "El usuario es requerido."
              }
            })
            }
          />
          <Input
            label="Contraseña"
            variant="flat"
            isInvalid={errors.password ? true : false}
            errorMessage={errors?.password?.message}
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <IoEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            {
            ...register("password", {
              required: {
                value: true,
                message: "La contraseña es requerida."
              },
            })
            }
          />
          <button style={{ backgroundColor: styles.btnBackground }} className='text-white p-2 rounded-sm font-semibold'>Iniciar Sesión</button>
        </form>
      </div>
    </div>
  )
}

export default Home