import React, { useEffect, useState } from 'react';
import { styles } from '../../assets/styles/global-styles';
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { getLocalTimeZone, today, Time } from "@internationalized/date";
import { TimeInput } from "@nextui-org/date-input";
import { useForm } from 'react-hook-form';
import {Toaster,toast} from "sonner"
import { useAuth } from '../../context/auth-context';
import { practicasDisponibles } from '../../api/practicas';
import { CircularProgress } from '@nextui-org/react';
import { createLoans } from '../../api/loans';
import { useNavigate } from 'react-router-dom';

const RequestMaterials = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [practica, setPractica] = useState({});
    const { user,token } = useAuth();
    const [practicas, setPracticas] = useState([]);
    const [hora, setHora] = useState(new Time(7, 0));
    const [errorText, setErrorText] = useState("");
    const [equipoLab, setEquipoLab] = useState(new Set());
    const [quantities, setQuantities] = useState([]);
    const [quantityErrors, setQuantityErrors] = useState({});
    const [matErrors, setMatErros] = useState("");
    const [load, setLoad] = useState(true);
    const handleLabEquipChange = (keys) => {
        const newKeys = new Set(keys);
        setEquipoLab(newKeys);
        updateQuantities(newKeys);
    };

    const updateQuantities = (newEquipoLab) => {
        const updatedQuantities = [];
        const updateKeys = (keys) => {
            keys.forEach(key => {
                const existing = quantities.find(item => item._id === key);
                if (existing) {
                    updatedQuantities.push(existing);
                } else {
                    updatedQuantities.push({ _id: key, cantidad: 1 });
                }
            });
        };
        updateKeys(newEquipoLab);
        setQuantities(updatedQuantities);
    };

    const handleQuantityChange = (key, value, maxQuantity) => {
        const newValue = parseInt(value) || 1;
        const newErrors = { ...quantityErrors };
        if (maxQuantity === 0) {
            newErrors[key] = 'Lo sentimos no contamos con unidades disponibles.';
        } else if (newValue < 1) {
            newErrors[key] = 'La cantidad mínima es 1';
        } else if (newValue > maxQuantity) {
            newErrors[key] = `La cantidad máxima es ${maxQuantity}`;
        } else {
            delete newErrors[key];
        }

        setQuantityErrors(newErrors);
        setQuantities((prevQuantities) => prevQuantities.map(item => item._id === key ? { ...item, cantidad: newValue } : item));
    };

    const getEquipoLabById = (id) => practica?.materiales.find(equipo => equipo._id === id) || '';

    const handleChangeHora = (value) => setHora(value);

    const formatTime = (time) => {
        let { hour, minute } = time;
        if (hour > 20 || hour <= 6) {
            setErrorText("Horario no permitido.");
            setTimeout(() => setErrorText(""), 2000);
            throw new Error("Horario no permitido.");
        }
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 <20 ? "0" + hour : hour || 12;
        minute = minute < 10 ? '0' + minute : minute;
        return `${hour}:${minute} ${ampm}`;
    };

    const formatDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); 
        const day = String(now.getDate()).padStart(2, '0');
        
        return `${day}/${month}/${year}`;
    };

    const getCurrentTime = () => {
        const now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        if (hour > 20 || hour <= 6) {
            setErrorText("Horario no permitido.");
            setTimeout(() => setErrorText(""), 2000);
            throw new Error("Horario no permitido.");
        }
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12; 
        hour = hour < 10 ? "0" + hour : hour;   
        minute = minute < 10 ? '0' + minute : minute;
        return `${hour}:${minute} ${ampm}`;
    };
    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (values) => {
        if (quantities.length === 0 || Object.keys(quantityErrors).length > 0) {
            setMatErros("Debes seleccionar al menos un material.");
        } else {
            const newData = {
                ...values,
                alumno: user._id,
                horaEntregaSolicitud: getCurrentTime(),
                profesor:practica.profesor._id,
                materiales: quantities,
                nombrePractica:practica.practica,
                fechaMaterialRequerido:practica.fecha,
                fecha:formatDate(),
                id_Practica:practica._id,
                horaMaterialRequerido:formatTime(hora),
                asignatura:practica?.asignatura?._id
            };
            try {
                const res = await createLoans(newData,token);
                if(res){
                    toast.success("La solicitud ha sido enviada.");
                    setTimeout(() => {
                        navigate("/solicitudes-alumno");
                    }, 1000);
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    });
    useEffect(() => {
        const getAllMaterials = async () => {
            const practicasApi = await practicasDisponibles({ cuatrimestre: user.cuatrimestre, grupo: user.grupo },token);
            setPracticas(practicasApi.data);
             setLoad(false);
        };
        getAllMaterials();
       
    }, []);
    return (
        <div className='w-full sm:p-10 sm:px-20 p-5'>
            <Toaster richColors/>
            {
                load == true ? (
                    <div className="w-full h-52 flex justify-center items-center">
                        <CircularProgress size="lg" color="warning" aria-label="Loading..." />
                    </div>
                ) : (
                    practicas?.length === 0 && !load ? (
                        <div className="w-full mt-10">
                            <p className='text-center text-gray-500 font-bold'>No tienes practicas disponibles.</p>
                        </div>
                    ) : (
                        <div className="shadow-md p-2 border-2 rounded-lg">
                            <p className='text-center font-bold'>Solicitar materiales</p>

                            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 mt-2 gap-5 p-5 justify-center">

                                <div className="flex flex-col gap-4">
                                    <Select
                                        label="Practica"
                                        variant='bordered'
                                        isInvalid={errors?.asignatura ? true : false}
                                        errorMessage={errors?.asignatura?.message}
                                        {...register("asignatura", { required: "La materia es requerida" })}

                                    >
                                        {
                                            practicas?.map(mat => (
                                                <SelectItem onClick={() => setPractica({ ...mat })} key={mat._id}>{mat.practica}</SelectItem>
                                            ))
                                        }
                                    </Select>
                                    <Input
                                        label="Materia"
                                        value={practica?.asignatura?.nombre}
                                        variant='bordered'
                                        disabled
                                    />
                                    <Input
                                        label="Docente"
                                        value={practica?.profesor?.nombre}
                                        variant='bordered'
                                        disabled
                                    />

                                    <Input
                                        label="Docente"
                                        value={practica?.fecha}
                                        variant='bordered'
                                        disabled
                                    />


                                    <TimeInput
                                        label="Hora requerida"
                                        variant='bordered'
                                        defaultValue={new Time(7, 0)}
                                        maxValue={new Time(20)}
                                        minValue={new Time(7)}
                                        value={hora}
                                        onChange={handleChangeHora}
                                        errorMessage={errorText}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">

                                    <div className="flex w-full flex-col gap-2">
                                        <Select
                                            label="Materiales"
                                            selectionMode="multiple"
                                            selectedKeys={equipoLab}
                                            variant='bordered'
                                            onSelectionChange={handleLabEquipChange}
                                        >
                                            {practica?.materiales?.map(item => (
                                                <SelectItem key={item._id} value={item._id}>{item.nombre}</SelectItem>
                                            ))}
                                        </Select>
                                        {equipoLab.size > 0 && Array.from(equipoLab).map(key => (
                                            <div key={key}>
                                                <Input
                                                    label={`Cantidad para ${getEquipoLabById(key).nombre}`}
                                                    type="number"
                                                    variant='bordered'
                                                    min={1}
                                                    value={quantities.find(item => item._id === key)?.cantidad || getEquipoLabById(key).nombre}
                                                    onChange={(e) => handleQuantityChange(key, e.target.value, getEquipoLabById(key).disponible)}
                                                    errorMessage={quantityErrors[key] || ''}
                                                    isInvalid={!!quantityErrors[key]}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {
                                        quantities.length === 0 && <p className='text-red-500 text-sm text-center '>{matErrors}</p>
                                    }
                                    <button className={"text-white p-2 "} style={{ backgroundColor: styles.btnBackground }} type="submit">Solicitar</button>

                                </div>
                            </form>
                        </div>
                    )
                )
            }

        </div>
    );
};

export default RequestMaterials;
