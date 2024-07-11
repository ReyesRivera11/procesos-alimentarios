import React, { useState } from 'react';
import { styles } from '../../assets/styles/global-styles';
import { useAuth } from '../../context/auth-context';
import { useForm } from 'react-hook-form';
import { changePassword, changePasswordDocente } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Input } from "@nextui-org/react";
import { toast, Toaster } from 'sonner';

const ChangePasswordDocente = () => {
    const { user, signOut } = useAuth();
    const { register, formState: { errors }, handleSubmit, watch } = useForm();
    const [textError, setTextError] = useState('');
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = React.useState(false);
    const [newPass, setNewPass] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleVisibilityNew = () => setNewPass(!isVisible);
    const toggleVisibilityConfirm = () => setConfirm(!isVisible);

    const onSubmit = handleSubmit(async (values) => {
        try {
            const token = localStorage.getItem('token');
            
            const res = await changePasswordDocente(user._id, values);
            if (res) {
                toast.success("Contraseña actualizada.");
                setTimeout(()=>{
                    signOut();
                    navigate('/');
                    setTextError('');
                },1000)
            }
        } catch (error) {
            // toast.error(error.response.data.message)
            setTextError(error.response.data.message);
            setTimeout(() => {
                setTextError('');
            }, 2000);
        }
    });

    return (
        <div className="w-full h-lvh ">
           <Toaster richColors/>   
            <div className="flex justify-center w-full flex-col items-center">
               
                <div className="mt-5 sm:w-[500px] w-full shadow-md p-5  border-2 rounded-lg">
                    <p className='text-center font-bold text-xl'>Cambiar contraseña</p>
                    <p className="text-gray-400 semi-bold text-center">Ingrese la contraseña actual y la nueva contraseña.</p>
                    <form onSubmit={onSubmit} className="flex flex-col mt-5 gap-5 p-5">
                        <Input
                            label="Contraseña actual"
                            variant="bordered"
                            isInvalid={errors.actualPassword ? true : false || textError.length>0 ? true : false}
                            errorMessage={errors?.actualPassword?.message || textError}
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
                            ...register("actualPassword", {
                                required: {
                                    value: true,
                                    message: "La contraseña es requerida."
                                },
                            })
                            }
                        />

                        <Input
                            label="Contraseña nueva"
                            variant="bordered"
                            isInvalid={errors.password ? true : false}
                            errorMessage={errors?.password?.message}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibilityNew}>
                                    {newPass ? (
                                        <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <IoEye className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={newPass ? "text" : "password"}
                            {
                            ...register("password", {
                                required: {
                                    value: true,
                                    message: "La contraseña es requerida."
                                },
                                minLength:{
                                    value:6,
                                    message:"La contraseña debe contener al menos 6 caracteres."
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/,
                                    message: "La contraseña debe contener al menos una minuscula, un mayuscula y un numero"
                                }
                            })
                            }
                        />
                        <Input
                            label="Confirmar contraseña"
                            variant="bordered"
                            isInvalid={errors.confirm ? true : false}
                            errorMessage={errors?.confirm?.message}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibilityConfirm}>
                                    {confirm ? (
                                        <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <IoEye className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={confirm ? "text" : "password"}
                            {
                            ...register("confirm", {
                                required: {
                                    value: true,
                                    message: "La contraseña es requerida."
                                },
                                validate: value => value === watch("password") || "Las contraseñas no coinciden"
                            })
                            }
                        />
                        <button className="text-white p-2 font-bold" style={{ backgroundColor: styles.btnBackground }}>Aceptar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordDocente;
