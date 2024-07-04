import React, { useEffect, useState } from 'react';
import { styles } from '../../assets/styles/global-styles';
import { Input } from "@nextui-org/input";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { DatePicker } from "@nextui-org/date-picker";
import { getLocalTimeZone, today, Time } from "@internationalized/date";
import { TimeInput } from "@nextui-org/date-input";
import { useForm } from 'react-hook-form';
import { getAditivos, getAllDocentes, getAllLaboratorio, getAllMaterias, getMatAlmacen, getMatLaboratorio } from '../../api/data-form';
import { useAuth } from '../../context/auth-context';

const RequestMaterials = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const {user} = useAuth();
    const [hora, setHora] = useState(new Time(7, 0));
    const [date, setDate] = useState(today(getLocalTimeZone()));
    const [errorText, setErrorText] = useState("");
    const [aditivos, setAditivos] = useState([]);
    const [laboratorio, setLaboratorio] = useState([]);
    const [laboratorioEquipo, setLaboratorioEquipo] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [almacen, setAlmacen] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [matLaboratorio, setMatLaboratorio] = useState(new Set());
    const [matAlmacen, setMatAlmacen] = useState(new Set());
    const [equipoLab, setEquipoLab] = useState(new Set());
    const [quantities, setQuantities] = useState([]);
    const [quantityErrors, setQuantityErrors] = useState({});
    const [matErrors,setMatErros] = useState("");

    const handleSelectionChange = (keys) => {
        const newKeys = new Set(keys);
        setSelectedKeys(newKeys);
        updateQuantities(newKeys, matLaboratorio, matAlmacen,equipoLab);
    };

    const handleMatAlmacenChange = (keys) => {
        const newKeys = new Set(keys);
        setMatAlmacen(newKeys);
        updateQuantities(selectedKeys, matLaboratorio, newKeys,equipoLab);
    };

    const handleLabEquipChange = (keys) => {
        const newKeys = new Set(keys);
        setEquipoLab(newKeys);
        updateQuantities(selectedKeys, matLaboratorio, matAlmacen, newKeys);
    };

    const handleMatLaboratorioChange = (keys) => {
        const newKeys = new Set(keys);
        setMatLaboratorio(newKeys);
        updateQuantities(selectedKeys, newKeys, matAlmacen,equipoLab);
    };

    const updateQuantities = (newAditivoKeys, newMatLaboratorioKeys, newMatAlmacenKeys,newEquipoLab) => {
        const updatedQuantities = [];
        const updateKeys = (keys) => {
            keys.forEach(key => {
                const existing = quantities.find(item => item._id === key);
                if (existing) {
                    updatedQuantities.push(existing);
                } else {
                    updatedQuantities.push({ _id: key, amount: 1 });
                }
            });
        };
        updateKeys(newAditivoKeys);
        updateKeys(newEquipoLab);
        updateKeys(newMatLaboratorioKeys);
        updateKeys(newMatAlmacenKeys);
        setQuantities(updatedQuantities);
    };

    const handleQuantityChange = (key, value, maxQuantity) => {
        const newValue = parseInt(value) || 1;
        const newErrors = { ...quantityErrors };
        if(maxQuantity === 0){
            newErrors[key] = 'Lo sentimos no contamos con unidades disponibles.';
        }else if (newValue < 1) {
            newErrors[key] = 'La cantidad mínima es 1';
        } else if (newValue > maxQuantity) {
            newErrors[key] = `La cantidad máxima es ${maxQuantity}`;
        } else {
            delete newErrors[key];
        }

        setQuantityErrors(newErrors);
        setQuantities((prevQuantities) => prevQuantities.map(item => item._id === key ? { ...item, amount: newValue } : item));
    };

    const getAditivoById = (id) => aditivos.find(aditivo => aditivo._id === id) || '';
    const getLaboratorioById = (id) => laboratorio.find(material => material._id === id) || '';
    const getAlmacenById = (id) => almacen.find(almacen => almacen._id === id) || '';
    const getEquipoLabById = (id) => laboratorioEquipo.find(equipo => equipo._id === id) || '';

    const handleChangeHora = (value) => setHora(value);
    const handleChangeDate = (value) => setDate(value);

    const formatTime = (time) => {
        let { hour, minute } = time;
        if (hour > 20 || hour <= 6) {
            setErrorText("Horario no permitido.");
            setTimeout(() => setErrorText(""), 2000);
            throw new Error("Horario no permitido.");
        }
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        minute = minute < 10 ? '0' + minute : minute;
        return `${hour}:${minute} ${ampm}`;
    };

    const formatDate = (date) => {
        const { year, month, day } = date;
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        return `${hours}:${minutes}:${seconds}`;
    };

    const onSubmit = handleSubmit(async (values) => {
        if(quantities.length===0 || Object.keys(quantityErrors).length>0){
            setMatErros("Debes seleccionar al menos un material.");
        }else{
            const newData = {
                ...values,
                alumno:user._id,
                horaEntregaSolicitud:getCurrentTime(),
                fechaMaterialRequerido:formatDate(date),
                horaMaterialRequerido:formatTime(hora),
                materiales:quantities
            }
            console.log(newData);
        }
    });

    useEffect(() => {
        const getAllMaterials = async () => {
            const aditivos = await getAditivos();
            const almacen = await getMatAlmacen();
            const laboratorio = await getMatLaboratorio();
            const profesores = await getAllDocentes();
            const materias = await getAllMaterias();
            const equipoLab = await getAllLaboratorio();
            setProfesores(profesores.data);
            setMaterias(materias.data);
            setAditivos(aditivos.data);
            setAlmacen(almacen.data);
            setLaboratorio(laboratorio.data);
            setLaboratorioEquipo(equipoLab.data)
        };
        getAllMaterials();
    }, []);

    return (
        <div className='w-full sm:p-10 sm:px-20 p-5'>
            <div className="shadow-md p-2 border-2 rounded-lg">
                <p className='text-center font-bold'>Solicitar materiales</p>
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 mt-2 gap-5 p-5 justify-center">
                    <div className="flex flex-col gap-4">
                        <Select
                            label="Materia"
                            variant='bordered'
                            isInvalid={errors?.asignatura ? true : false}
                            errorMessage={errors?.asignatura?.message}
                            {...register("asignatura", { required: "La materia es requerida" })}
                        >
                            {
                                materias.map(mat => (
                                    <SelectItem key={mat._id}>{mat.nombre}</SelectItem>
                                ))
                            }
                        </Select>
                        <Select
                            label="Docente"
                            variant='bordered'
                            isInvalid={errors.profesor ? true : false}
                            errorMessage={errors?.profesor?.message}
                            {...register("profesor", { required: "El docente es requerido." })}
                        >
                            {
                                profesores.map(item =>(
                                <SelectItem key={item._id}>{item.nombre}</SelectItem>
                            ))
                            }
                            
                        </Select>
                        <Input
                            
                            type="text"
                            label="Practica"
                            variant='bordered'
                            isInvalid={errors?.nombrePractica ? true : false}
                            errorMessage={errors?.nombrePractica?.message}
                            {...register("nombrePractica", {
                                required: "El nombre de la practica es requerido.",
                                minLength: { value: 6, message: "Debe contener al menos 6 caracteres." },
                                pattern: { value: /^[a-zA-Z0-9 ]*$/, message: "Solo debe contener letras y numeros." }
                            })}
                        />
                        <DatePicker
                            label="Fecha requerida"
                            variant='bordered'
                            minValue={today(getLocalTimeZone())}
                            defaultValue={today(getLocalTimeZone())}
                            maxValue={today(getLocalTimeZone()).add({ weeks: 2 })}
                            value={date}
                            onChange={handleChangeDate}
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
                                label="Aditivo"
                                selectionMode="multiple"
                                selectedKeys={selectedKeys}
                                variant='bordered'
                                onSelectionChange={handleSelectionChange}
                            >
                                {aditivos.map(item => (
                                    <SelectItem variant='bordered' key={item._id} value={item._id}>
                                        {item.nombre}
                                    </SelectItem>
                                ))}
                            </Select>
                            {selectedKeys.size > 0 && Array.from(selectedKeys).map(key => (
                                <div key={key}>
                                    <Input
                                        label={`Cantidad para ${getAditivoById(key).nombre}`}
                                        type="number"
                                        variant='bordered'
                                        min={1}
                                        value={quantities.find(item => item._id === key)?.amount || '1'}
                                        onChange={(e) => handleQuantityChange(key, e.target.value, getAditivoById(key).cantidad)}
                                        errorMessage={quantityErrors[key] || ''}
                                        isInvalid={!!quantityErrors[key]}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex w-full flex-col gap-2">
                            <Select
                                label="Material laboratorio"
                                selectionMode="multiple"
                                selectedKeys={matLaboratorio}
                                variant='bordered'
                                onSelectionChange={handleMatLaboratorioChange}
                            >
                                {laboratorio.map(item => (
                                    <SelectItem key={item._id} value={item._id}>{item.nombre}</SelectItem>
                                ))}
                            </Select>
                            {matLaboratorio.size > 0 && Array.from(matLaboratorio).map(key => (
                                <div key={key}>
                                    <Input
                                        label={`Cantidad para ${getLaboratorioById(key).nombre}`}
                                        type="number"
                                        variant='bordered'
                                        min={1}
                                        value={quantities.find(item => item._id === key)?.amount || '1'}
                                        onChange={(e) => handleQuantityChange(key, e.target.value, getLaboratorioById(key).existencias)}
                                        errorMessage={quantityErrors[key] || ''}
                                        isInvalid={!!quantityErrors[key]}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex w-full flex-col gap-2">
                            <Select
                                label="Material almacen"
                                selectionMode="multiple"
                                selectedKeys={matAlmacen}
                                variant='bordered'
                                onSelectionChange={handleMatAlmacenChange}
                            >
                                {almacen.map(item => (
                                    <SelectItem key={item._id} value={item._id}>{item.nombre}</SelectItem>
                                ))}
                            </Select>
                            {matAlmacen.size > 0 && Array.from(matAlmacen).map(key => (
                                <div key={key}>
                                    <Input
                                        label={`Cantidad para ${getAlmacenById(key).nombre}`}
                                        type="number"
                                        variant='bordered'
                                        min={1}
                                        value={quantities.find(item => item._id === key)?.amount || '1'}
                                        onChange={(e) => handleQuantityChange(key, e.target.value, getAlmacenById(key).existencias)}
                                        errorMessage={quantityErrors[key] || ''}
                                        isInvalid={!!quantityErrors[key]}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex w-full flex-col gap-2">
                            <Select
                                label="Equipo de laboratorio"
                                selectionMode="multiple"
                                selectedKeys={equipoLab}
                                variant='bordered'
                                onSelectionChange={handleLabEquipChange}
                            >
                                {laboratorioEquipo.map(item => (
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
                                        value={quantities.find(item => item._id === key)?.amount || '1'}
                                        onChange={(e) => handleQuantityChange(key, e.target.value, getEquipoLabById(key).cantidad)}
                                        errorMessage={quantityErrors[key] || ''}
                                        isInvalid={!!quantityErrors[key]}
                                    />
                                </div>
                            ))}
                        </div>
                        {
                            quantities.length===0&& <p className='text-red-500 text-sm text-center '>{matErrors}</p>
                        }
                        <button className={"text-white p-2 "} style={{backgroundColor:styles.btnBackground}} type="submit">Solicitar</button>
                    
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestMaterials;
