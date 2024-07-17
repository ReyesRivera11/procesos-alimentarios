import { styles } from "../../../assets/styles/global-styles"
import { Input } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { getMaterialLabById,updateMaterialLab} from "../../../api/materiales";
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth-context";
function EditarMaterialLab() {
    const params = useParams();
    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues:{
            nombre:'',
            existencias:''
        }
    });
    const navigate = useNavigate();
    const [data, setData]= useState([]);
    const {token} = useAuth();
    const onSubmit = handleSubmit(async (values) => {
        try {
            const newData = {
                nombre: values.nombre.toUpperCase(),
                existencias: parseInt(values.existencias)
            }
            const res = await updateMaterialLab(params.id, newData,token);
            if (res) {
                toast.success("El material se editó correctamente.");
                setTimeout(() => {
                    navigate("/materialesLab");
                }, 1000);
            } else toast.error("Error en el servidor.");

        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    });
    
    useEffect(()=>{
        const getMaterialesLab = async ()=>{
            const res = await getMaterialLabById(params.id)
            if(res){
                setData(res.data);
                reset(res.data);
            }
        }
        getMaterialesLab();
    },[params.id, reset])

    return (
        <div className='w-full sm:p-5 sm:px-20 p-5 flex justify-center'>
            <Toaster richColors />
            <div className="w-[480px]  p-10 shadow-xl border rounded-3xl">
                <div className="flex flex-col gap-2 items-center justify-center">
                    <p className="text-xl font-bold text-black text-center">Editar Material</p>
                    <p className=" text-gray-500">Llena los campos requeridos para editar un material a tu inventario.</p>
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
                                    value: 40,
                                    message: "El nombre debe de contener la menos 40 caracteres"
                                }
                            }}
                            render={({ field }) =>
                                <Input
                                    label="Nombre Material"
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
                            name="existencias"
                            control={control}
                            rules={{
                                required: "La cantidad es requerida",
                                min: {
                                    value: 1,
                                    message: "La minima cantidad es de 1",

                                },
                                max: {
                                    value: 100,
                                    message: "La cantidad maxima es 100"
                                }
                            }}
                            render={({ field }) =>
                                <Input
                                    label="Cantidad Material"
                                    variant="bordered"
                                    isInvalid={errors?.existencias ? true : false}
                                    type="number"
                                    errorMessage={errors?.existencias?.message}
                                    {
                                    ...field
                                    } />
                            }
                        />

                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button type="button" onClick={() => navigate("/materialesLab")} className='text-white rounded-md p-2 font-semibold w-32 bg-red-600'>
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

export default EditarMaterialLab