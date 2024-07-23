import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Tooltip } from "@nextui-org/react";
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import LogoProcesos from "../assets/images/procesos_alimentarios-removebg-preview.png";
import UthhLogo from "../assets/images/uthh-logo.png";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

import { getPracticasById } from '../api/practicas';

const ModalPracticas = ({ id }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [size, setSize] = React.useState('md');
    const [data, setData] = useState({});
    const handleOpen = (size) => {
        setSize(size)
        onOpen();
    };
    useEffect(() => {
        const getLoan = async () => {
            const res = await getPracticasById(id);
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
                                        <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data[0]?.asignatura?.nombre}</p>
                                    </div>
                                    <div className="grid gap-3 grid-cols-2 md:gap-5">
                                        <div>
                                            <label className='font-semibold'>Fecha de la practica:</label>
                                            <p className="border border-gray-300 p-1 rounded-md  uppercase">{data[0]?.fecha}</p>
                                        </div>
                                        <div>
                                            <label className='font-semibold'>Catrimestre y Grupo:</label>
                                            <p className="border border-gray-300 p-1 rounded-md  uppercase">
                                                {data[0]?.cuatrimestre} {data[0]?.grupo}
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                <div className='flex md:flex-row flex-col gap-4 '>
                                    <div className='md:w-[70%]'>
                                        <label className='font-semibold'>Nombre de la práctica:</label>
                                        <p className='border border-gray-300 p-1 rounded-md  uppercase'>{data[0]?.practica}</p>
                                    </div>
                                    <div>
                                        <label className='font-semibold'>Estado de la solicitud</label>
                                        <p className='border border-gray-300 p-1 rounded-md  uppercase'>
                                            {data[0]?.estado}
                                        </p>
                                    </div>
                                </div>


                                <Table className=' border border-gray-200 rounded-2xl' aria-label="Example static collection table">
                                    <TableHeader>
                                        <TableColumn className='text-center text-sm font-bold' key={"nombre"}>Material</TableColumn>
                                        <TableColumn className='w-28 text-center text-sm font-bold' key={"cantidad"}>Cantidad solicitada</TableColumn>
                                        
                                    </TableHeader>
                                    <TableBody items={data[0]?.materiales}>
                                        {(item) => (
                                            <TableRow key={item?.nombre}>
                                                <TableCell className=" uppercase">{item?.nombre}</TableCell>
                                                <TableCell className="text-center">{item?.cantidad}</TableCell>
                                            
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

export default ModalPracticas;
