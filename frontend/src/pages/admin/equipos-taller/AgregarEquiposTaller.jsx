import { styles } from "../../../assets/styles/global-styles"
import { useForm } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { createEquipoTaller } from "../../../api/materiales";
import { useNavigate } from "react-router-dom";

function AgregarEquiposTaller() {
    const { register, formState: { errors }, handleSubmit, watch } = useForm();
    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (values) => {
        try {
            const data = {
                ...values,
                nombre: values.nombre.toUpperCase(),
                enUso:values.enUso == "true" ? true : false
            }
            console.log(data);

            const res = await createEquipoTaller(data);
            if (res) {
                toast.success("El equipo de taller se agrego.");
                setTimeout(() => {
                    navigate("/equipos-taller");
                }, 2000);
            }else toast.error("Error en el servidor.");
        }
        catch (error) {
             toast.error(error.response.data.message);
        }
    });

    return (
        <div className='w-full sm:p-5 sm:px-20 p-5 flex justify-center'>
            <Toaster richColors />
            <div className="w-[480px]  p-10 shadow-xl border rounded-3xl">
                <div className="flex flex-col gap-2 items-center justify-center">
                    <p className="text-xl font-bold text-black text-center">Agregar Equipo</p>
                    <p className=" text-gray-500">Llena los campos requeridos para agregar un nuevo equipo de taller.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 my-10 paddin">
                    <div className="flex items-center justify-between">
                        <Input
                            label="Nombre Equipo"
                            variant="bordered"
                            isInvalid={errors?.nombre ? true : false}
                            errorMessage={errors?.nombre?.message}
                            {
                            ...register("nombre", {
                                required: "El nombre es requerido",
                                minLength: {
                                    value: 3,
                                    message: "El nombre debe contener al menos 3 caracteres",
                                },
                                maxLength: {
                                    value: 40,
                                    message: "El nombre debe de contener la menos 40 caracteres"
                                }
                            })
                            } />
                    </div>
                    <div className="flex items-center justify-between">
                        <Select
                            label="En uso"
                            placeholder="Selecciona el uso "
                            variant="bordered"
                            isInvalid={errors?.estado ? true : false}
                            errorMessage={errors?.estado?.message}
                            {
                            ...register("enUso", {
                                required: "El campo es requerido",

                            })
                            }
                        >

                            <SelectItem key={true}>
                                En uso
                            </SelectItem>
                            <SelectItem key={false}>
                                Libre
                            </SelectItem>
                        </Select>

                    </div>
                    <div className="flex items-center justify-between">
                        <Select
                            label="Estado"
                            placeholder="Selecciona el estado."
                            variant="bordered"
                            isInvalid={errors?.estado ? true : false}
                            errorMessage={errors?.estado?.message}
                            {
                            ...register("estado", {
                                required: "El estado es requerido",

                            })
                            }
                        >

                            <SelectItem key={"ACTIVO"}>
                                Activo
                            </SelectItem>
                            <SelectItem key={"INACTIVO"}>
                                Inactivo
                            </SelectItem>
                        </Select>

                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button className="text-white rounded-md p-2 font-semibold w-32 bg-red-600" type="button" onClick={() => navigate("/equipos-taller")}>
                            Cancelar
                        </button>
                        <button type="submit" className="text-white rounded-md p-2 font-semibold w-32 bg-green-600">
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AgregarEquiposTaller;