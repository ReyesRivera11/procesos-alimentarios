import { styles } from "../../../assets/styles/global-styles"
import { useForm } from "react-hook-form";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom"
import { cuatrimestre } from "../../../data/cuatrimestre-grupo";
import { createAsignatura } from "../../../api/asignaturas";
function AgregarAsignatura() {
    const { register, formState: { errors }, handleSubmit, watch } = useForm();
    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (values) => {
        try {
            const data = {
                ...values,
                nombre:values.nombre.toUpperCase(),
            }

            const res = await createAsignatura(data);
            if (res) {
                toast.success("La asignatura se creo correctamente.");
                setTimeout(() => {
                    navigate("/asignaturas");
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
                    <p className="text-xl font-bold text-black text-center">Agregar Asignatura</p>
                    <p className=" text-gray-500">Llena los campos requeridos para agregar una nueva asignatura.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 my-10 paddin">
                    <div className="flex items-center justify-between ">

                        <Input
                            label="Nombre "
                            variant="bordered"
                            isInvalid={errors?.nombre ? true : false}
                            errorMessage={errors?.nombre?.message}
                            {
                            ...register("nombre", {
                                required: "El nombre es requerido",
                                minLength: {
                                    value: 5,
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
                        <Select
                            label="Cuatrimestre"
                            placeholder="Selecciona un cuatrimestre"
                            variant="bordered"
                            isInvalid={errors?.cuatrimestre ? true : false}
                            errorMessage={errors?.cuatrimestre?.message}
                            {
                            ...register("cuatrimestre", {
                                required: "El cuatrimestre es requerido",

                            })
                            }
                        >

                            {
                                cuatrimestre.map(cuatri => (
                                    <SelectItem key={cuatri}>
                                        {cuatri}
                                    </SelectItem>
                                ))
                            }

                        </Select>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button type="button" onClick={()=>navigate("/asignaturas")} className='text-white rounded-md p-2 font-semibold w-32 bg-red-600'>
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

export default AgregarAsignatura