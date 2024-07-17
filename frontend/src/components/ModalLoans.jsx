import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Tooltip } from "@nextui-org/react";
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import LogoProcesos from "../assets/images/procesos_alimentarios-removebg-preview.png";
import UthhLogo from "../assets/images/uthh-logo.png";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

import { getLoansById } from '../api/loans';
import { useAuth } from '../context/auth-context';

const ModalLoans = ({ id }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {token} = useAuth();
    const [size, setSize] = React.useState('md');
    const [data, setData] = useState({});
    const handleOpen = (size) => {
        setSize(size)
        onOpen();
    };

    useEffect(() => {
        const getLoan = async () => {
            const res = await getLoansById(id,token);
            if (res) {
                setData(res.data);
            }
        }
        getLoan();
    }, [id]);

    return (
        <>
            <div className="flex flex-wrap gap-3 ">
                <Tooltip content="Ver más">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <MdOutlineRemoveRedEye
                            onClick={() => handleOpen("3xl")}
                            className="text-gray-500 text-2xl" />
                    </span>
                </Tooltip>
            </div>
            <Modal
                size={size}
                isOpen={isOpen}
                onClose={onClose}
                backdrop={"blur"}
                className={"overflow-y-scroll max-h-[600px] "}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-column justify-center gap-1 items-center">
                                <div className="">
                                    <img
                                        src={LogoProcesos}
                                        alt="Logo procesos alimentarios."
                                        className='w-14 h-14 object-contain'
                                    />
                                </div>
                                <div className="md:w-[600px] w-[400px]">
                                    <p className='uppercase text-xs sm:text-sm text-center'>Solicitud de materiales y reactivos para realizar prácticas en los laboratorios de la carrera de procesos alimentarios.</p>
                                </div>
                                <div className="">
                                    <img src={UthhLogo} alt="" className='w-48 h-14 object-contain' />
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                                    <div >
                                        <label className='font-semibold'>Asignatura:</label>
                                        <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data?.asignatura?.nombre}</p>
                                    </div>
                                    <div className="grid gap-3 grid-cols-2 md:gap-5">
                                        <div>
                                            <label className='font-semibold'>Fecha de la solicitud:</label>
                                            <p className="border border-gray-300 p-1 rounded-md  uppercase">{data?.fecha}</p>
                                        </div>
                                        <div>
                                            <label className='font-semibold text-center '>Hora:</label>
                                            <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data?.horaEntregaSolicitud}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                    <div>
                                        <label className='font-semibold'>Alumno:</label>
                                        <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data?.alumno?.nombre}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className='font-semibold'>Grado:</label>
                                            <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data?.alumno?.cuatrimestre}</p>
                                        </div>
                                        <div>
                                            <label className='font-semibold'>Grupo:</label>
                                            <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data?.alumno?.grupo}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className='font-semibold'>Nombre de la práctica:</label>
                                    <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data?.nombrePractica}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 items-center gap-5">
                                    <div>
                                        <label className='font-semibold'>Fecha en la que requiere el material:</label>
                                        <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data?.fechaMaterialRequerido}</p>
                                    </div>
                                    <div >
                                        <label className='font-semibold'>Hora:</label>
                                        <p className='border border-gray-300 p-1 rounded-md  uppercase' >{data?.horaMaterialRequerido}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-10">
                                    <div>
                                        <label className='font-semibold'>Estado de la solicitud</label>
                                        <p className='border border-gray-300 p-1 rounded-md  uppercase'>
                                            {data?.aceptado ? data?.aceptado ? "Aceptada" : "Rechazada" : "Pendiente"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='font-semibold'>Entrega</label>
                                        <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data?.entregado ? "Entregado" : "Sin entregar"}</p>
                                    </div>
                                    <div>
                                        <label className='font-semibold'>Devolución</label>
                                        <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data?.entregado ? "Devuelto" : "Sin devolver"}</p>
                                    </div>

                                </div>
                                <Table className=' border border-gray-200 rounded-2xl' aria-label="Example static collection table">
                                    <TableHeader>
                                        <TableColumn className='w-28 text-center text-sm font-bold' key={"cantidad"}>Cantidad</TableColumn>
                                        <TableColumn className='text-center text-sm font-bold' key={"nombre"}>Material</TableColumn>
                                    </TableHeader>
                                    <TableBody items={data?.materiales}>
                                        {(item) => (
                                            <TableRow key={item?.nombre}>
                                                <TableCell className="text-center">{item?.cantidad || item?.existencias}</TableCell>
                                                <TableCell className="text-center uppercase">{item?.nombre}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </ModalBody>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default ModalLoans;
