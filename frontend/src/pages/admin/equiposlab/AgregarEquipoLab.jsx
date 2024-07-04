import { useForm } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { createEquipoLab } from "../../../api/materiales";
import { useNavigate } from "react-router-dom"
function AgregarEquipoLab() {
    const { register, formState: { errors }, handleSubmit, watch } = useForm();
    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (values) => {
        try {
            console.log(values)
            const data = {
                nombre: values.nombre.toUpperCase(),
                cantidad: parseInt(values.cantidad)
            }
            const res = await createEquipoLab(data);
            if (res) {
                toast.success("El equipo se agrego.");
                setTimeout(() => {
                    navigate("/equipos-lab");
                }, 2000);
            }else{
                toast.error("Error en el servidor.");
            }


        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    });


    return (
        <div className='w-full sm:p-5 sm:px-20 p-5 flex justify-center'>
            <Toaster richColors />
            <div className=" w-[480px]  p-10 shadow-xl border rounded-3xl" >
                <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xl font-bold text-black text-center">Agregar Equipo</p>
                    <p className=" text-gray-500">Llena los campos requeridos para agregar un nuevo equipo de laboratorio.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 my-10 paddin">
                    <div className="flex items-center justify-between ">

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
                    </div>
                    <div className="flex items-center justify-between">
                        <Input
                            label="Cantidad"
                            variant="bordered"
                            isInvalid={errors?.cantidad ? true : false}
                            type="number"
                            errorMessage={errors?.cantidad?.message}
                            {
                            ...register("cantidad", {
                                required: "La cantidad es requerida",
                                min: {
                                    value: 1,
                                    message: "La minima cantidad es de 1",
                                },
                                max: {
                                    value: 100,
                                    message: "La cantidad maxima es 100"
                                }
                            })
                            } />
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button type="button" onClick={()=>navigate("/equipos-lab")} className='text-white rounded-md p-2 font-semibold w-32 bg-red-600'>
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

export default AgregarEquipoLab