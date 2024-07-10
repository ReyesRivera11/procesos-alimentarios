import { styles } from "../../../assets/styles/global-styles";
import { Controller, useForm } from "react-hook-form";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { allGrupos, cuatrimestre } from "../../../data/cuatrimestre-grupo";
import { createAlumno, getAlumnoById, updateAlumno } from "../../../api/alumnos";
import React, { useEffect } from "react";

function EditarAlumno() {
    const params = useParams();
    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: {
            nombre: "",
            matricula: "",
            estado: true,
            cuatrimestre: "",
            grupo: ""
        }
    });
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (values) => {
        try {
            
            const data = {
                nombre: values.nombre.toUpperCase(),
                matricula:values.matricula,
                estado: values.estado === "true" ? true : false,
                cuatrimestre: values.cuatrimestre,
                grupo:values.grupo
            };

            const res = await updateAlumno(params.id,data);
            if (res) {
                toast.success("El alumno se edito correctamente.");
                setTimeout(() => {
                    navigate("/alumnos");
                }, 2000);
            } else {
                toast.error("Error en el servidor.");
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }
    });

    useEffect(() => {
        const getAlumnos = async () => {
            const res = await getAlumnoById(params.id);
            if (res) {
                reset(res.data);
            }
        };
        getAlumnos();
    }, [params.id, reset]);



    return (
        <div className='w-full sm:p-5 sm:px-20 p-5 flex justify-center'>
            <Toaster richColors />
            <div className="w-[480px] px-10 py-5 shadow-xl border rounded-3xl">
                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xl font-bold text-black text-center">Editar Alumno</p>
                    <p className="text-gray-500">Llena los campos requeridos para editar un nuevo alumno.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 my-5 paddin">
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
                            />
                        )}
                    />
                    <Controller
                        name="matricula"
                        control={control}
                        rules={{
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
                                message: "La matricula debe de contener solo números."
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                label="Matricula"
                                variant="bordered"
                                isInvalid={Boolean(errors?.matricula)}
                                errorMessage={errors?.matricula?.message}
                            />
                        )}
                    />
                    <Controller
                        name="estado"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Estado"
                                placeholder="Selecciona un estado"
                                variant="bordered"
                                isInvalid={Boolean(errors?.estado)}
                                errorMessage={errors?.estado?.message}
                                selectedKeys={new Set([String(field.value)])} 
                            >
                                <SelectItem key="true" value="true">
                                    ACTIVO
                                </SelectItem>
                                <SelectItem key="false" value="false">
                                    INACTIVO
                                </SelectItem>
                            </Select>
                        )}
                    />

                    <div className="flex sm:flex-row flex-col gap-2 items-center justify-between">
                        <Controller
                            name="cuatrimestre"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Cuatrimestre"
                                    placeholder="Selecciona un cuatrimestre"
                                    variant="bordered"
                                    selectedKeys={new Set([field.value])}
                                    isInvalid={Boolean(errors?.cuatrimestre)}
                                    errorMessage={errors?.cuatrimestre?.message}
                                >
                                    {cuatrimestre.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />
                        <Controller
                            name="grupo"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Grupo"
                                    placeholder="Selecciona un grupo"
                                    variant="bordered"
                                    isInvalid={Boolean(errors?.grupo)}
                                    errorMessage={errors?.grupo?.message}
                                    selectedKeys={new Set([field.value])}
                                    onChange={field.onChange}

                                >
                                    {allGrupos.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button type="button" onClick={() => navigate("/alumnos")} className='text-white rounded-md p-2 font-semibold w-32 bg-red-600'>
                            Cancelar
                        </button>
                        <button type="submit" className='text-white rounded-md p-2 font-semibold w-32 bg-green-600'>
                            Editar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarAlumno;
