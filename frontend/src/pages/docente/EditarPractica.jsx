import React, { forwardRef, useEffect, useState } from 'react';
import { styles } from '../../assets/styles/global-styles';
import { Input } from "@nextui-org/input";
import { Button, CircularProgress, Tooltip } from '@nextui-org/react';
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { CiCalendarDate } from "react-icons/ci";
import { DatePicker } from "@nextui-org/date-picker";
import { getLocalTimeZone, today, Time } from "@internationalized/date";
import { TimeInput } from "@nextui-org/date-input";
import { Controller, useForm } from 'react-hook-form';
import { getAditivos, getAllDocentes, getAllLaboratorio, getAllMaterias, getMatAlmacen, getMatLaboratorio } from '../../api/data-form';
import { useAuth } from '../../context/auth-context';
import { getAllEquipoTaller } from '../../api/materiales';
import { allGrupos, cuatrimestre } from '../../data/cuatrimestre-grupo';
import { crearPractica, getPracticasById, updatePractica } from '../../api/practicas';
import { toast, Toaster } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';

const EditarPractica = () => {
    const { register, formState: { errors }, handleSubmit, control, reset } = useForm();
    const { user,token } = useAuth();
    const [date, setDate] = useState(today(getLocalTimeZone()));
    const [aditivos, setAditivos] = useState([]);
    const [laboratorio, setLaboratorio] = useState([]);
    const [laboratorioEquipo, setLaboratorioEquipo] = useState([]);
    const [tallerEquipo, setTallerEquipo] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [almacen, setAlmacen] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [matLaboratorio, setMatLaboratorio] = useState(new Set());
    const [matAlmacen, setMatAlmacen] = useState(new Set());
    const [equipoLab, setEquipoLab] = useState(new Set());
    const [equipoTaller, setEquipoTaller] = useState(new Set());
    const [quantities, setQuantities] = useState([]);
    const [quantityErrors, setQuantityErrors] = useState({});
    const [matErrors, setMatErros] = useState("");
    const [materiaSelected, setMateriaSelected] = useState([]);
    const [cuatri, setCuatri] = useState("");
    const [load, setLoad] = useState(false);
    const [fecha, setFecha] = useState(false);
    const params = useParams();

    const handleSelectionChange = (keys) => {
        const newKeys = new Set(keys);
        setSelectedKeys(newKeys);
        updateQuantities(newKeys, matLaboratorio, matAlmacen, equipoLab, equipoTaller);
    };

    const handleChangeDate = (value) => setDate(value);


    const handleMatAlmacenChange = (keys) => {
        const newKeys = new Set(keys);
        setMatAlmacen(newKeys);
        updateQuantities(selectedKeys, matLaboratorio, newKeys, equipoLab, equipoTaller);
    };

    const handleLabEquipChange = (keys) => {
        const newKeys = new Set(keys);
        setEquipoLab(newKeys);
        updateQuantities(selectedKeys, matLaboratorio, matAlmacen, newKeys, equipoTaller);
    };

    const handleMatLaboratorioChange = (keys) => {
        const newKeys = new Set(keys);
        setMatLaboratorio(newKeys);
        updateQuantities(selectedKeys, newKeys, matAlmacen, equipoLab, equipoTaller);
    };

    const handleTallerEquipChange = (keys) => {
        const newKeys = new Set(keys);
        setEquipoTaller(newKeys);
        updateQuantities(selectedKeys, matLaboratorio, matAlmacen, equipoLab, newKeys);
    };

    const updateQuantities = (newAditivoKeys, newMatLaboratorioKeys, newMatAlmacenKeys, newEquipoLabKeys, newEquipoTallerKeys) => {
        const updatedQuantities = [];
        const updateKeys = (keys) => {
            keys.forEach(key => {
                const existing = quantities.find(item => item._id === key);
                if (existing) {
                    updatedQuantities.push(existing);
                } else {
                    updatedQuantities.push({ _id: key, cantidad: 1});
                }
            });
        };
        updateKeys(newAditivoKeys);
        updateKeys(newEquipoLabKeys);
        updateKeys(newMatLaboratorioKeys);
        updateKeys(newMatAlmacenKeys);
        updateKeys(newEquipoTallerKeys);
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
        setQuantities((prevQuantities) => prevQuantities.map(item => item._id === key ? { ...item, cantidad: newValue} : item));
    };


    const getAditivoById = (id) => aditivos.find(aditivo => aditivo._id === id) || '';
    const getLaboratorioById = (id) => laboratorio.find(material => material._id === id) || '';
    const getAlmacenById = (id) => almacen.find(almacen => almacen._id === id) || '';
    const getEquipoLabById = (id) => laboratorioEquipo.find(equipo => equipo._id === id) || '';
    const getEquipoTallerById = (id) => tallerEquipo.find(equipo => equipo._id === id) || '';

    const formatDate = (date) => {
        const { year, month, day } = date;
        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };

    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (values) => {
        if (quantities.length === 0 || Object.keys(quantityErrors).length > 0) {
            setMatErros("Debes seleccionar al menos un material.");
        } else {
            const { asignatura, cuatrimestre, grupo, practica } = values;
            const newData = {
                asignatura,
                cuatrimestre,
                grupo,
                practica,
                materiales: quantities,
            }
            if (fecha) {
                newData.fecha = formatDate(date)
            }
            try {
                const res = await updatePractica(params.id,newData,token);
                if (res) {
                    toast.success("Practica editada correctamente.");
                    setTimeout(() => {
                        navigate("/practicas-docente")
                    }, 1000);
                }
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error.response.data.message);
            }
        }
    });
    useEffect(() => {
        const getAllMaterials = async () => {
            const aditivos = await getAditivos();
            const almacen = await getMatAlmacen();
            const laboratorio = await getMatLaboratorio();
            const materiasApi = await getAllMaterias();
            const equipoLab = await getAllLaboratorio();
            const equipoTaller = await getAllEquipoTaller();
            const getPractica = await getPracticasById(params.id);

            // Carga de datos
            setCuatri(getPractica.data[0].cuatrimestre);
            setTallerEquipo(equipoTaller.data);
            setMaterias(materiasApi.data);
            setAditivos(aditivos.data);
            setAlmacen(almacen.data);
            setLaboratorio(laboratorio.data);
            setLaboratorioEquipo(equipoLab.data);
            reset({
                ...getPractica.data[0],
                asignatura: getPractica.data[0].asignatura._id,
            });

            const selectedAditivos = getPractica.data[0].materiales.filter(mat => aditivos.data.some(al => al._id === mat._id)).map(mat => mat._id);
            const selectedMatAlmacen = getPractica.data[0].materiales.filter(mat => almacen.data.some(al => al._id === mat._id)).map(mat => mat._id);
            const selectedMatLaboratorio = getPractica.data[0].materiales.filter(mat => laboratorio.data.some(lab => lab._id === mat._id)).map(mat => mat._id);
            const selectedEquipoLab = getPractica.data[0].materiales.filter(mat => equipoLab.data.some(eql => eql._id === mat._id)).map(mat => mat._id);
            const selectedEquipoTaller = getPractica.data[0].materiales.filter(mat => equipoTaller.data.some(eqt => eqt._id === mat._id)).map(mat => mat._id);

            setSelectedKeys(new Set(selectedAditivos));
            setMatAlmacen(new Set(selectedMatAlmacen));
            setMatLaboratorio(new Set(selectedMatLaboratorio));
            setEquipoLab(new Set(selectedEquipoLab));
            setEquipoTaller(new Set(selectedEquipoTaller));

            // Actualizar cantidades
            const quantities = getPractica.data[0].materiales.map(mat => ({
                _id: mat._id,
                cantidad: mat.cantidad,
                disponible: aditivos.data.find(al => al._id === mat._id)?.cantidad ||
                    almacen.data.find(al => al._id === mat._id)?.cantidad ||
                    laboratorio.data.find(lab => lab._id === mat._id)?.cantidad ||
                    equipoLab.data.find(eql => eql._id === mat._id)?.cantidad ||
                    equipoTaller.data.find(eqt => eqt._id === mat._id)?.cantidad || 0
            }));
            setQuantities(quantities);

            setLoad(true);
        };
        getAllMaterials();
    }, []);


    useEffect(() => {
        if (cuatri) {
            const filteredMaterias = materias.filter(mat => mat.cuatrimestre === cuatri);
            setMateriaSelected(filteredMaterias);
        } else {
            setMateriaSelected([]);
        }
    }, [cuatri, materias]);
    return (
        <div className='w-full sm:p-10 sm:px-20 p-5'>
            <Toaster richColors />
            <div className="shadow-md p-2 border-2 rounded-lg">
                <p className='text-center font-bold'>Solicitar materiales</p>
                {
                    load && materiaSelected.length > 0 ? (<form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 mt-2 gap-5 p-5 justify-center">
                        <div className="flex flex-col gap-4">
                            <Input
                                type="text"
                                label="Docente"
                                variant='bordered'
                                value={user?.nombre}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                                            isInvalid={Boolean(errors?.cuatrimestre)}
                                            errorMessage={errors?.cuatrimestre?.message}
                                        >
                                            {cuatrimestre.map((item) => (
                                                <SelectItem onClick={() => setCuatri(item)} key={item} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                <Controller
                                    name="grupo"
                                    control={control}
                                    rules={{ required: "El grupo es requerido" }}
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
                            <Controller
                                name='asignatura'
                                rules={{ required: "La materia es requerida" }}
                                control={control}
                                render={({ field }) => <Select
                                    {...field}
                                    label="Materia"
                                    variant='bordered'
                                    isInvalid={errors?.asignatura ? true : false}
                                    errorMessage={errors?.asignatura?.message}
                                    selectedKeys={new Set([field.value])}
                                    onChange={field.onChange}
                                >
                                    {materiaSelected.length === 0 ? (
                                        <SelectItem key="empty" disabled>
                                            No hay materias disponibles para el cuatrimestre seleccionado
                                        </SelectItem>
                                    ) : (
                                        materiaSelected.map(mat => (
                                            <SelectItem key={mat._id} value={mat.nombre}>
                                                {mat.nombre}
                                            </SelectItem>
                                        ))
                                    )}
                                </Select>}
                            />

                            <Controller
                                name='practica'
                                control={control}
                                rules={{
                                    required: "El nombre de la practica es requerido.",
                                    minLength: { value: 6, message: "Debe contener al menos 6 caracteres." },
                                    pattern: { value: /^[a-zA-Z0-9 ]*$/, message: "Solo debe contener letras y numeros." }
                                }}
                                render={({ field }) => <Input
                                    {...field}
                                    type="text"
                                    label="Practica"
                                    variant='bordered'
                                    isInvalid={Boolean(errors?.practica)}
                                    errorMessage={errors?.practica?.message}

                                />}
                            />

                            <Controller
                                name='fecha'
                                control={control}
                                render={({ field }) => <Input
                                    {...field}
                                    type="text"
                                    label="Fecha actual"
                                    variant='bordered'
                                    disabled
                                />}
                            />
                            <div className='w-full flex gap-2 justify-end items-center'>
                                {
                                    fecha && (
                                        <DatePicker
                                            label="Fecha nueva"
                                            variant='bordered'
                                            minValue={today(getLocalTimeZone())}
                                            defaultValue={today(getLocalTimeZone())}
                                            maxValue={today(getLocalTimeZone()).add({ weeks: 2 })}
                                            value={date}
                                            onChange={handleChangeDate}
                                        />

                                    )
                                }
                                <Button type='button' onClick={() => setFecha(!fecha)} isIconOnly variant='flat'>
                                    <Tooltip content={fecha ? "Cancelar" : "Editar fecha"}>
                                        <span>
                                            <CiCalendarDate className='text-xl' />
                                        </span>
                                    </Tooltip>
                                </Button>
                            </div>

                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex w-full flex-col gap-2">
                                <Select
                                    name='mat_aditivo'
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
                                            value={quantities.find(item => item._id === key)?.cantidad || '1'}
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
                                            value={quantities.find(item => item._id === key)?.cantidad || '1'}
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
                                            value={quantities.find(item => item._id === key)?.cantidad || '1'}
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
                                            value={quantities.find(item => item._id === key)?.cantidad || '1'}
                                            onChange={(e) => handleQuantityChange(key, e.target.value, getEquipoLabById(key).cantidad)}
                                            errorMessage={quantityErrors[key] || ''}
                                            isInvalid={!!quantityErrors[key]}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex w-full flex-col gap-2">
                                <Select
                                    label="Equipo de taller"
                                    selectionMode="multiple"
                                    selectedKeys={equipoTaller}
                                    variant='bordered'
                                    onSelectionChange={handleTallerEquipChange}
                                >
                                    {tallerEquipo.map(item => (
                                        <SelectItem key={item._id} value={item._id}>{item.nombre}</SelectItem>
                                    ))}
                                </Select>
                                {equipoTaller.size > 0 && Array.from(equipoTaller).map(key => (
                                    <div key={key}>
                                        <Input
                                            label={`Cantidad para ${getEquipoTallerById(key).nombre}`}
                                            type="number"
                                            variant='bordered'
                                            min={1}
                                            value={quantities.find(item => item._id === key)?.cantidad || '1'}
                                            onChange={(e) => handleQuantityChange(key, e.target.value, 1)}
                                            errorMessage={quantityErrors[key] || ''}
                                            isInvalid={!!quantityErrors[key]}
                                        />
                                    </div>
                                ))}
                            </div>
                            {
                                quantities.length === 0 && <p className='text-red-500 text-sm text-center '>{matErrors}</p>
                            }
                            <button onClick={() => onSubmit} className={"text-white p-2 "} style={{ backgroundColor: styles.btnBackground }} type="submit">Solicitar</button>

                        </div>
                    </form>) : <div className="w-full h-52 flex justify-center items-center">
                        <CircularProgress size="lg" color="warning" aria-label="Loading..." />
                    </div>
                }


            </div>
        </div>
    );
};

export default EditarPractica;
