import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Tooltip } from "@nextui-org/react";
import { PiWarningCircleLight } from "react-icons/pi";
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

const ModalDelete = ({ id,texto,handleFunction }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [size, setSize] = React.useState('md');
    const handleOpen = (size) => {
        setSize(size)
        onOpen();
    };
    const handleReject = () =>{
        handleFunction(id);
        onClose();
    }

    return (
        <>
            <div className="flex flex-wrap gap-3">
                <Tooltip content="Rechazar">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <IoCloseCircle
                            onClick={() => handleOpen("2xl")}
                            className="text-red-500 text-2xl" />
                    </span>
                </Tooltip>
            </div>
            <Modal
                size={size}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col items-center justify-center">
                                <PiWarningCircleLight className='text-8xl text-orange-600'/>
                                <p>¿Estás seguro?</p>
                            </ModalHeader>
                            <ModalBody className='flex flex-col'>
                                <p className='text-center text-xl'>{texto}</p>
                                <div className="flex gap-5 justify-center mt-5">
                                    <Button onClick={onClose}  className='text-xl bg-gray-400 text-white font-bold'>
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleReject} className='text-xl bg-red-500 text-white font-bold'>
                                        Aceptar
                                    </Button>
                                </div>
                            </ModalBody>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default ModalDelete;
