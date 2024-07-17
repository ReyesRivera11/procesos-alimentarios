import { Controller, useForm } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import {  getAditivoById, updateAditivo } from "../../../api/materiales";
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import {useAuth} from "../../../context/auth-context";
function EditarAditivo() {
    const params = useParams();
    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: {
            nombre: '',
            cantidad: ''
        }
    });
    const {token} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const onSubmit = handleSubmit(async (values) => {
        const { nombre, cantidad } = values;
        const newData = {
            nombre, cantidad
        }
        try {
            const newData = {
                nombre: values.nombre.toUpperCase(),
                cantidad: parseInt(values.cantidad)
            }
            const res = await updateAditivo(params.id, newData,token);
            if (res) {
                toast.success("El aditivo se editó correctamente.");
                setTimeout(() => {
                    navigate("/aditivos");
                }, 1000);
            } else {
                toast.error("Error en el servidor.");
            }


        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    });

    useEffect(() => {
        const getAditivos = async () => {
            const res = await getAditivoById(params.id)
            if (res) {
                setData(res.data);
                reset(res.data);
            }
        }
        getAditivos();
    }, [params.id, reset])

    return (
        <div className='w-full sm:p-5 sm:px-20 p-5 flex justify-center'>
            <Toaster richColors />
            <div className=" w-[480px]  p-10 shadow-xl border rounded-3xl" >
                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xl font-bold text-black text-center">Editar Aditivo</p>
                    <p className=" text-gray-500">Llena los campos requeridos para editar un aditivo a tu inventario.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 my-10 paddin">
                    <div className="flex items-center justify-between ">
                        <Controller
                            name="nombre"
                            control={control}
                            rules={{
                                required: "El nombre es requerido",
                                minLength: {
                                    value: 3,
                                    message: "El nombre debe contener al menos 3 caracteres",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "El nombre debe de contener la menos 50 caracteres"
                                }
                            }}
                            render={({ field }) =>
                                <Input
                                    label="Nombre Aditivo"
                                    variant="bordered"
                                    isInvalid={errors?.nombre ? true : false}
                                    errorMessage={errors?.nombre?.message}
                                    {
                                    ...field
                                    } />
                            }
                        />

                    </div>
                    <div className="flex items-center justify-between">
                        <Controller
                            name="cantidad"
                            control={control}
                            rules={{
                                required: "La cantidad es requerida",
                                min: {
                                    value: 1,
                                    message: "La minima cantidad es de 1",
                                },
                                max: {
                                    value: 100,
                                    message: "La maxima cantidad es 100"
                                }
                            }}
                            render={({ field }) =>
                                <Input
                                    label="Cantidad Aditivo"
                                    variant="bordered"
                                    isInvalid={errors?.cantidad ? true : false}
                                    type="number"
                                    errorMessage={errors?.cantidad?.message}
                                    {
                                    ...field
                                    } />
                            }
                        />

                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button type="button" onClick={() => navigate("/aditivos")} className='text-white rounded-md p-2 font-semibold w-32 bg-red-600'>
                            Cancelar
                        </button>
                        <button className='text-white rounded-md p-2 font-semibold w-32 bg-green-600'>
                            Editar
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default EditarAditivo
