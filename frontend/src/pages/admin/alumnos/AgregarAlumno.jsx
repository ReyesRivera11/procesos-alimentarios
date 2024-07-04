import { styles } from "../../../assets/styles/global-styles"
import { useForm } from "react-hook-form";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom"
import { allGrupos, cuatrimestre } from "../../../data/cuatrimestre-grupo";
import { createAsignatura, getAllAsignaturas } from "../../../api/asignaturas";
import React, { useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { createProfesor } from "../../../api/profesores";
import { createAlumno } from "../../../api/alumnos";

function AgregarAlumno() {
    const { register, formState: { errors }, handleSubmit, watch } = useForm();
    const navigate = useNavigate();
    const [pass, setPass] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);

    const toggleVisibilityPass = () => setPass(!pass);
    const toggleVisibilityConfirm = () => setConfirm(!confirm);
    const onSubmit = handleSubmit(async (values) => {
      
        try {
            const data = {
                ...values,
                nombre: values.nombre.toUpperCase(),
            };

            console.log(data);
            
            const res = await createAlumno(data);
            if (res) {
                toast.success("El alumno se creo correctamente.");
                setTimeout(() => {
                    navigate("/alumnos");
                }, 2000);
            } else toast.error("Error en el servidor.");
            
        }
        catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }
    });


    return (
        <div className='w-full sm:p-5 sm:px-20 p-5 flex justify-center'>
            <Toaster richColors />
            <div className=" w-[480px]  px-10 py-5 shadow-xl border rounded-3xl" >
                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xl font-bold text-black text-center">Agregar Alumno</p>
                    <p className=" text-gray-500">Llena los campos requeridos para agregar un nuevo alumno.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 my-5 paddin">

                    <Input
                        label="Nombre"
                        variant="bordered"
                        isInvalid={Boolean(errors?.nombre)}
                        errorMessage={errors?.nombre?.message}
                        {
                        ...register("nombre", {
                            required: "El nombre es requerido",
                            minLength: {
                                value: 3,
                                message: "El nombre debe contener al menos tres caracteres",
                            },
                            maxLength: {
                                value: 50,
                                message: "El nombre debe de contener la menos 50 caracteres"
                            }
                        })
                        } />
                    <Input
                        label="Matricula"
                        variant="bordered"
                        isInvalid={Boolean(errors?.matricula)}
                        errorMessage={errors?.matricula?.message}
                        {
                        ...register("matricula", {
                            required: "La matricula es requerida.",
                            minLength: {
                                value: 8,
                                message: "La matricula debe de contener 8 caracteres."
                            },
                            maxLength: {
                                value: 8,
                                message: "La matricula debe de contener 8 caracteres."
                            },
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "La matricula debe de contener solo numeros."
                            }
                        })
                        } />


                    <Input
                        label="Contraseña"
                        variant="bordered"
                        isInvalid={Boolean(errors.password)}
                        errorMessage={errors?.password?.message}
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibilityPass}>
                                {pass ? (
                                    <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <IoEye className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={pass ? "text" : "password"}
                        {
                        ...register("password", {
                            required: {
                                value: true,
                                message: "La contraseña es requerida."
                            },
                            minLength: {
                                value: 8,
                                message: "La contraseña debe contener al menos 8 caracteres."
                            },
                            maxLength: {
                                value: 8,
                                message: "La contraseña debe contener maximo 8 caracteres."
                            },
                            
                        })
                        }
                    />

                    <div className="flex sm:flex-row flex-col gap-2 items-center justify-between">
                        <Select
                            label="Cuatrimestre"
                            placeholder="Selecciona un cuatrimestre"
                            variant="bordered"
                            isInvalid={Boolean(errors?.cuatrimestre)}
                            errorMessage={errors?.cuatrimestre?.message}
                            {
                            ...register("cuatrimestre", {
                                required: "El cuatrimestre es requerido.",
                            })
                            }
                        >

                            {
                                cuatrimestre.map(item => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))
                            }

                        </Select>
                        <Select
                            label="Grupo"
                            placeholder="Selecciona un grupo"
                            variant="bordered"
                            isInvalid={Boolean(errors?.grupo)}
                            errorMessage={errors?.grupo?.message}
                            {
                            ...register("grupo", {
                                required: "El cuatrimestre es requerido.",
                            })
                            }
                        >

                            {
                                allGrupos.map(item => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))
                            }

                        </Select>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button type="button" onClick={() => navigate("/alumnos")} className='text-white rounded-md p-2 font-semibold w-32 bg-red-600'>
                            Cancelar
                        </button>
                        <button className='text-white rounded-md p-2 font-semibold w-32 bg-green-600'>
                            Agregar
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default AgregarAlumno