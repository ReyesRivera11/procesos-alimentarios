import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Tooltip, Input } from "@nextui-org/react";
import React, { useEffect } from "react";
import { acceptDelivery, getAllLoansApi, getAllLoansToDeliver, getAllRequests, requestsVal } from "../../../api/loans";
import { CiSearch } from "react-icons/ci";
import ModalLoans from "../../../components/ModalLoans";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import ModalDelete from "../../../components/ModalDelete";
import { Toaster, toast } from 'sonner';
import ModalAccept from "../../../components/ModalAccept";
import { CircularProgress } from "@nextui-org/react";
import { useAuth } from "../../../context/auth-context";

const Delivered = () => {
    const [data, setData] = React.useState([]);
    const {token} = useAuth();
    const [loaded, setLoaded] = React.useState(true);
    const [filteredData, setFilteredData] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [filterValue, setFilterValue] = React.useState("");
    const rowsPerPage = 10;
    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredData.slice(start, end);
    }, [page, filteredData]);

    useEffect(() => {
        const getAllLoans = async () => {
            const res = await getAllLoansToDeliver(token);
            if (res) {
                setLoaded(false);
                setData(res.data);
                setFilteredData(res.data);
            }
            setLoaded(false);
        };
        getAllLoans();
    }, []);

    useEffect(() => {
        const lowercasedFilter = filterValue.toLowerCase();
        const filteredData = data.filter(item => {
            return (
                item?.alumno?.nombre.toLowerCase().includes(lowercasedFilter) ||
                item?.nombrePractica.toLowerCase().includes(lowercasedFilter) ||
                item?.fechaMaterialRequerido.toLowerCase().includes(lowercasedFilter) ||
                item?.horaMaterialRequerido.toLowerCase().includes(lowercasedFilter)

            );
        });
        setFilteredData(filteredData);
        setPage(1);
    }, [filterValue, data]);

    const onSearchChange = React.useCallback((e) => {
        const { value } = e.target;
        setFilterValue(value);
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const getKeyValue = (item, columnKey) => {
        if (columnKey === 'alumno' && typeof item[columnKey] === 'object') {
            return item[columnKey]?.nombre;
        }
        if (columnKey === 'entregado') {
             return item[columnKey] ? "Entregado":"Pendiente"
        }
        return item[columnKey];
    };

    const handleAcceptRequest = async (id) => {
        try {
            const res = await acceptDelivery({ entregado: true, id },token);
            if (res) {
                toast.success('Solicitud entregada.');
                setData(data.filter(item => item._id !== id));
            }
        } catch (error) {
            toast.error(`${error.response.data.message}`, {
                duration: 5000
            });
        }
    };

    return (
        <div className='w-full sm:p-10 sm:px-20 p-5'>
            <Toaster richColors />
            <div className="">
                <p className="text-center text-3xl font-bold ">Entregas</p>
                <div className="w-full flex justify-center mb-5">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[400px]"
                        placeholder="Buscar"
                        startContent={<CiSearch />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onChange={onSearchChange}
                    />
                </div>

            </div>
            {
                loaded ? <div className="w-full h-52 flex justify-center items-center">
                    <CircularProgress size="lg" color="warning" aria-label="Loading..." />
                </div> :
                    data.length === 0 ?
                        (
                            <div className="flex justify-center items-center h-52">
                                <p className="mt-10 font-bold text-gray-500">No hay solicitudes pendientes</p>
                            </div>
                        ) : <Table
                            aria-label="Example table with client side pagination"
                            bottomContent={
                                <div className="flex w-full justify-center">
                                    <Pagination
                                        isCompact
                                        showControls
                                        showShadow
                                        color="warning"
                                        page={page}
                                        total={pages}
                                        onChange={(page) => setPage(page)}
                                    />
                                </div>
                            }
                            className="h-full"
                        >
                            <TableHeader >
                                <TableColumn
                                    className="text-center font-bold text-sm w-96"
                                    key="alumno"
                                >
                                    Alumno
                                </TableColumn>
                                <TableColumn
                                    className="text-center font-bold text-sm"
                                    key="nombrePractica"
                                >
                                    Práctica
                                </TableColumn>
                                <TableColumn
                                    className="text-center font-bold text-sm"
                                    key="fechaMaterialRequerido"
                                >
                                    Fecha
                                </TableColumn>
                                <TableColumn
                                    className="text-center font-bold text-sm"
                                    key="horaMaterialRequerido"
                                >
                                    Hora
                                </TableColumn>
                                <TableColumn
                                    className="text-center font-bold text-sm"
                                    key="entregado"
                                >
                                    Entregada
                                </TableColumn>
                                <TableColumn
                                    className="text-center font-bold text-sm"
                                    key="acciones"
                                >
                                    Acciones
                                </TableColumn>
                            </TableHeader>
                            <TableBody items={items}>
                                {(item) => (
                                    <TableRow key={item._id}>
                                        {(columnKey) => (
                                            columnKey === 'acciones' ? (
                                                <TableCell className="text-center flex justify-center gap-3">
                                                    <Button variant="flat" isIconOnly>
                                                        {
                                                            <ModalLoans id={item._id} />
                                                        }

                                                    </Button>

                                                    <Button color="success" isIconOnly variant="flat">
                                                        {
                                                            <ModalAccept
                                                                handleFunction={handleAcceptRequest}
                                                                id={item?._id}
                                                                texto={`Estas apunto de confirmar la entrega del material para la practica ${item?.nombrePractica} del alumno ${item?.alumno?.nombre}.`}
                                                            />
                                                        }
                                                    </Button>

                                                </TableCell>
                                            ) : (
                                                <TableCell className={`text-center uppercase ${columnKey === "alumno" && "w-96"}`}>{getKeyValue(item, columnKey)}</TableCell>
                                            )
                                        )}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
            }

        </div>
    );
};

export default Delivered;
