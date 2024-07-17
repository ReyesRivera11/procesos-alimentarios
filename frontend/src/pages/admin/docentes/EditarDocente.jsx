import { styles } from "../../../assets/styles/global-styles";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { cuatrimestre } from "../../../data/cuatrimestre-grupo";
import { createAsignatura, getAllAsignaturas } from "../../../api/asignaturas";
import React, { useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { createProfesor, getProfesorById, updateProfesor } from "../../../api/profesores";
import { MdPassword } from "react-icons/md";
import { useAuth } from "../../../context/auth-context";
function EditarDocente() {
    const { register, formState: { errors }, handleSubmit, reset, control,watch } = useForm();
    const navigate = useNavigate();
    const [pass, setPass] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);
    const [materias, setMaterias] = useState([]);
    const params = useParams();
    const toggleVisibilityPass = () => setPass(!pass);
    const toggleVisibilityConfirm = () => setConfirm(!confirm);
    const [values, setValues] = React.useState(new Set([]));
    const [editPass, setEditPass] = useState(false);
    const {token} = useAuth();
    const onSubmit = handleSubmit(async (values) => {
        let { materias, nombre, correo } = values;
        let mat = materias;
        if (typeof materias === "string") {
            const materiasNew = materias.split(",");
            mat = materiasNew
        }
        const data = {
            nombre:nombre.toUpperCase(),
            correo,
            materias: mat,
        }
        if(editPass){
            data.password = values.password;
        }
        try {
            const res = await updateProfesor(params.id, data,token);
            if (res) {
                toast.success("Datos actualizados correctamente.");
                setTimeout(() => {
                    navigate("/docentes");
                }, 1000);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    });
    useEffect(() => {
        const getAsignaturas = async () => {
            const res = await getAllAsignaturas(token);
            if (res) {
                setMaterias(res.data);
            }
        };
        const getDocente = async () => {
            const res = await getProfesorById(params.id,token);
            if (res) {
                const { nombre, correo, materias } = res.data;
                const newVal = materias.map(materia => materia._id);
                setValues(newVal)
                reset({
                    nombre,
                    correo,
                    materias: materias.map(materia => materia._id), 
                });
            }
        };

        getDocente();
        getAsignaturas();
    }, [params.id, reset]);

    return (
        <div className='w-full sm:p-5 sm:px-20 p-5 flex justify-center'>
            <Toaster richColors />
            <div className="w-[480px] px-10 py-5 shadow-xl border rounded-3xl">
                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xl font-bold text-black text-center">Editar Docente</p>
                    <p className="text-gray-500">Llena los campos requeridos a editar.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 my-5 padding">
                    <div className="flex  flex-col items-center justify-between gap-2">
                        <Controller
                            name="nombre"
                            control={control}
                            rules={{
                                required: "El nombre es requerido",
                                minLength: {
                                    value: 3,
                                    message: "El nombre debe contener al menos tres caracteres",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "El nombre debe de contener al menos 50 caracteres"
                                }
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Nombre"
                                    variant="bordered"
                                    isInvalid={Boolean(errors?.nombre)}
                                    errorMessage={errors?.nombre?.message}
                                    autoComplete="off" // Disable autocomplete
                                />
                            )}
                        />
                        <Controller
                            name="correo"
                            control={control}
                            rules={{
                                required: "El correo es requerido",
                                pattern: {
                                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                    message: "El email no es válido",
                                },
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Correo"
                                    variant="bordered"
                                    isInvalid={Boolean(errors?.correo)}
                                    errorMessage={errors?.correo?.message}
                                    autoComplete="off" // Disable autocomplete
                                />
                            )}
                        />
                        <Controller
                            name="materias"
                            control={control}
                            rules={{
                                required: "La asignatura es requerida.",
                            }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Asignaturas"
                                    selectionMode="multiple"
                                    placeholder="Selecciona las asignaturas"
                                    variant="bordered"
                                    selectedKeys={values}
                                    onSelectionChange={setValues}
                                    isInvalid={errors?.materias ? true : false}
                                    errorMessage={errors?.materias?.message}
                                >
                                    {materias.map((materia) => (
                                        <SelectItem
                                            key={materia._id}
                                            value={materia._id}
                                        >
                                            {materia.nombre}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />

                        {
                            editPass && (
                                <div className="w-full flex flex-col gap-2">
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
                                </div>
                            )
                        }

                        <div className="w-full flex justify-end ">
                            <Button isIconOnly onClick={() => setEditPass(!editPass)} className="" type="button" variant="solid" color="default">
                                <Tooltip content={editPass ? "Cancelar" : "Editar contraseña"}>
                                    <span>
                                        <MdPassword />
                                    </span>
                                </Tooltip>
                            </Button>
                        </div>


                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button type="button" onClick={() => navigate("/docentes")} className='text-white rounded-md p-2 font-semibold w-32 bg-red-600'>
                            Cancelar
                        </button>
                        <button className='text-white rounded-md p-2 font-semibold w-32 bg-green-600'>
                            Editar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarDocente;
