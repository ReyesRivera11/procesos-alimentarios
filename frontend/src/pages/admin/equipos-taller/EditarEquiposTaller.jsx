import { styles } from "../../../assets/styles/global-styles"
import { Controller, set, useForm } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { createEquipoTaller,getEquipoTallerById,updateEquipoTaller } from "../../../api/materiales";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function EditarEquiposTaller() {
    const params = useParams();
    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues:{
            nombre:'',
            enUso:'',
            estado:''
        }
    });

    const navigate = useNavigate();
    const [data, setData]=useState([]);
    const onSubmit = handleSubmit(async (values) => {
        const {nombre, enUso,estado}=values;
        const newData = {
            nombre,
            enUso,
            estado
        }
        console.log(newData);
        try {
            const newData = {
                ...values,
                nombre: values.nombre.toUpperCase(),
                enUso: values.enUso == "true" ? true : false
            }

            const res = await updateEquipoTaller(params.id, newData);
            if (res) {
                toast.success("El equipo de taller se editó.");
                setTimeout(() => {
                    navigate("/equipos-taller");
                }, 1000);
            } else toast.error("Error en el servidor.");
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    });
    useEffect(()=>{
        const getEquipoTaller = async ()=>{
            const res = await getEquipoTallerById(params.id)
            if(res){
                setData(res.data);
                reset(res.data);
            }
        }
        getEquipoTaller();
    },[params.id,reset])
    return (
        <div className='w-full sm:p-5 sm:px-20 p-5 flex justify-center'>
            <Toaster richColors />
            <div className="w-[480px]  p-10 shadow-xl border rounded-3xl">
                <div className="flex flex-col gap-2 items-center justify-center">
                    <p className="text-xl font-bold text-black text-center">Editar Equipo</p>
                    <p className=" text-gray-500">Llena los campos requeridos para editar un equipo de taller.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 my-10 paddin">
                    <div className="flex items-center justify-between">
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
                                    label="Nombre Equipo"
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
                            name="enUso"
                            control={control}
                            rules={{
                                required: "El campo es requerido",
                            }}
                            render={({ field }) =>
                                <Select
                                    label="En uso"
                                    placeholder="Selecciona el uso "
                                    variant="bordered"
                                    isInvalid={errors?.enUso ? true : false}
                                    errorMessage={errors?.enUso?.message}
                                    // onSelectionChange={(value) => console.log(value)}
                                    selectedKeys={new Set([field.value.toString()])}
                                    {
                                    ...field
                                    }
                                >

                                    <SelectItem key={true}>
                                        En uso
                                    </SelectItem>
                                    <SelectItem key={false}>
                                        Libre
                                    </SelectItem>
                                </Select>
                            }
                        />


                    </div>
                    <div className="flex items-center justify-between">
                        <Controller
                            name="estado"
                            control={control}
                            rules={{
                                required: "El estado es requerido",

                            }}
                            render={({ field }) =>
                                <Select
                                    label="Estado"
                                    placeholder="Selecciona el estado."
                                    variant="bordered"
                                    isInvalid={Boolean(errors?.estado)}
                                    errorMessage={errors?.estado?.message}
                                    selectedKeys={new Set([field.value])}
                                    {
                                    ...field
                                    }
                                >

                                    <SelectItem key={"ACTIVO"}>
                                        Activo
                                    </SelectItem>
                                    <SelectItem key={"INACTIVO"}>
                                        Inactivo
                                    </SelectItem>
                                </Select>
                            }
                        />


                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button className="text-white rounded-md p-2 font-semibold w-32 bg-red-600" type="button" onClick={() => navigate("/equipos-taller")}>
                            Cancelar
                        </button>
                        <button type="submit" className="text-white rounded-md p-2 font-semibold w-32 bg-green-600">
                            Editar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarEquiposTaller;