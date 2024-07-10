import { useForm, Controller } from "react-hook-form";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { cuatrimestre } from "../../../data/cuatrimestre-grupo";
import { getAsignaturaById, updateAsignatura } from "../../../api/asignaturas";
import { useEffect, useState } from "react";

function EditarAsignatura() {
    const navigate = useNavigate();
    const params = useParams();
    const [data, setData] = useState();
    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: {
            nombre: '',
            cuatrimestre: ''
        }
    });

    const onSubmit = handleSubmit(async (values) => {
        const { cuatrimestre, nombre } = values;
        const newData = {
            cuatrimestre,
            nombre
        }
        try {
            const res = await updateAsignatura(params.id, newData);
            if (res) {
                toast.success("Asignatura editada correctamente.");
                setTimeout(() => {
                    navigate("/asignaturas");
                }, 1000);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    });

    useEffect(() => {
        const getAsignatura = async () => {
            const res = await getAsignaturaById(params.id);
            if (res) {
                setData(res.data);
                reset(res.data);
            }
        };
        getAsignatura();
    }, [params.id, reset]);

    return (
        <div className='w-full sm:p-5 sm:px-20 p-5 flex justify-center'>
            <Toaster richColors />
            <div className=" w-[480px]  p-10 shadow-xl border rounded-3xl">
                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xl font-bold text-black text-center">Editar Asignatura</p>
                    <p className=" text-gray-500">Llena los campos requeridos para editar la asignatura.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 my-10 paddin">
                    <div className="flex items-center justify-between">
                        <Controller
                            name="nombre"
                            control={control}
                            rules={{
                                required: "El nombre es requerido",
                                minLength: {
                                    value: 5,
                                    message: "El nombre debe contener al menos cinco caracteres",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "El nombre debe contener un máximo de 50 caracteres"
                                }
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Nombre"
                                    variant="bordered"
                                    isInvalid={errors?.nombre ? true : false}
                                    errorMessage={errors?.nombre?.message}
                                />
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Controller
                            name="cuatrimestre"
                            control={control}
                            rules={{ required: "El cuatrimestre es requerido" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Cuatrimestre"
                                    placeholder="Selecciona un cuatrimestre"
                                    variant="bordered"
                                    selectedKeys={new Set([field.value])}
                                    isInvalid={errors?.cuatrimestre ? true : false}
                                    onSelectionChange={(value) => field.onChange(value)}
                                >
                                    {cuatrimestre.map(cuatri => (
                                        <SelectItem key={cuatri} value={cuatri}>
                                            {cuatri}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button type="button" onClick={() => navigate("/asignaturas")} className='text-white rounded-md p-2 font-semibold w-32 bg-red-600'>
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

export default EditarAsignatura;
