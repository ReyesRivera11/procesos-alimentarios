import { styles } from "../../../assets/styles/global-styles"
import { useForm } from "react-hook-form";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom"
import { cuatrimestre } from "../../../data/cuatrimestre-grupo";
import { createAsignatura, getAllAsignaturas } from "../../../api/asignaturas";
import React, { useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { createProfesor } from "../../../api/profesores";

function AgregarDocente() {
    const { register, formState: { errors }, handleSubmit, watch } = useForm();
    const navigate = useNavigate();
    const [pass, setPass] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);
    const [materias,setMaterias] = useState([]);

    const toggleVisibilityPass = () => setPass(!pass);
    const toggleVisibilityConfirm = () => setConfirm(!confirm);
    const onSubmit = handleSubmit(async (values) => {
        const {materias,nombre,correo,password} = values;
        const newMaterias = materias.split(",");
        try {
            console.log(values);
            const data = {
                correo,
                password,
                nombre: values.nombre.toUpperCase(),
                materias:newMaterias,
            };

            const res = await createProfesor(data);
            if (res) {
                toast.success("El docente se creo correctamente.");
                setTimeout(() => {
                    navigate("/docentes");
                }, 2000);
            } else {
                toast.error("Error en el servidor.");
            }


        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    });

    useEffect(() => {
        const getAsignaturas = async () => {
            const res = await getAllAsignaturas();
            if(res){
                setMaterias(res.data)
            }
        }
        getAsignaturas();
    }, [])
    


    return (
        <div className='w-full sm:p-5 sm:px-20 p-5 flex justify-center'>
            <Toaster richColors />
            <div className=" w-[480px]  px-10 py-5 shadow-xl border rounded-3xl" >
                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xl font-bold text-black text-center">Agregar Docente</p>
                    <p className=" text-gray-500">Llena los campos requeridos para agregar un nuevo docente.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 my-5 paddin">
                    <div className="flex md:flex-row flex-col items-center justify-between gap-2">
                        <Input
                            label="Nombre"
                            variant="bordered"
                            isInvalid={errors?.nombre ? true : false}
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
                            label="Correo"
                            variant="bordered"
                            isInvalid={errors?.correo ? true : false}
                            errorMessage={errors?.correo?.message}
                            {
                            ...register("correo", {
                                required: "El correo es requerido",
                                pattern: {
                                    // TODO: Es una expresion regular
                                    value: /^[a-z0-9._%+-]+@[a-z0-9·-]+\.[a-z]{2,4}$/,
                                    message: "El email no es valido",
                                },
                            })
                            } />
                    </div>

                    <Input
                        label="Contraseña"
                        variant="bordered"
                        isInvalid={errors.password ? true : false}
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
                                value: 6,
                                message: "La contraseña debe contener al menos 6 caracteres."
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

                    <div className="flex items-center justify-between">
                        <Select
                            label="Asignaturas"
                            selectionMode="multiple"
                            placeholder="Selecciona un cuatrimestre"
                            variant="bordered"
                            isInvalid={errors?.materias ? true : false}
                            errorMessage={errors?.materias?.message}
                            {
                            ...register("materias", {
                                required: "La asignatura es requerida.",
                            })
                            }
                        >

                            {
                                materias.map(materia => (
                                    <SelectItem key={materia._id}>
                                        {materia?.nombre}
                                    </SelectItem>
                                ))
                            }

                        </Select>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button type="button" onClick={()=>navigate("/docentes")} className='text-white rounded-md p-2 font-semibold w-32 bg-red-600'>
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

export default AgregarDocente