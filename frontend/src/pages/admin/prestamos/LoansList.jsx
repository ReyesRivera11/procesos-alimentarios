import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Tooltip, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import React, { useEffect } from "react";
import { deleteLoan, getAllLoansApi } from "../../../api/loans";
import { CiSearch } from "react-icons/ci";
import ModalLoans from "../../../components/ModalLoans";
import { CircularProgress } from "@nextui-org/react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ModalDeleteItem from "../../../components/ModalDeleteItem";
import { Toaster, toast } from "sonner";

const LoansList = () => {
    const [data, setData] = React.useState([]);
    const [loaded, setLoaded] = React.useState(true);
    const [alumnoArrow, setAlumnoArrow] = React.useState(false);
    const [practicaArrow, setPracticaArrow] = React.useState(false);
    const [fechaArrow, setFechaArrow] = React.useState(false);
    const [filteredData, setFilteredData] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [filterValue, setFilterValue] = React.useState("");
    const [sortConfig, setSortConfig] = React.useState({ key: null, direction: null });
    const rowsPerPage = 10;
    const pages = Math.ceil(filteredData.length / rowsPerPage);

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split("/");
        return new Date(`${year}-${month}-${day}`);
    };

    const sortedData = React.useMemo(() => {
        if (sortConfig.key) {
            const sorted = [...filteredData].sort((a, b) => {
                let aKey = a[sortConfig.key];
                let bKey = b[sortConfig.key];
                if (sortConfig.key === 'alumno') {
                    aKey = a.alumno?.nombre ?? '';
                    bKey = b.alumno?.nombre ?? '';
                } else if (sortConfig.key === 'fechaMaterialRequerido') {
                    aKey = parseDate(aKey);
                    bKey = parseDate(bKey);
                }

                if (aKey < bKey) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aKey > bKey) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            return sorted;
        }
        return filteredData;
    }, [filteredData, sortConfig]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedData.slice(start, end);
    }, [page, sortedData]);

    useEffect(() => {
        const getAllLoans = async () => {
            const res = await getAllLoansApi();
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
            return item[columnKey].nombre;
        }
        return item[columnKey];
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    const handleDelete = async (key) => {
        try {
            const res = await deleteLoan(key);
            if (res) {
                toast.success("Solicitud eliminado correctamente.");
                setData(data.filter(item => item._id !== key));
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className='w-full sm:p-10 sm:px-20 p-5'>
            <Toaster richColors />
            <div className="">
                <p className="text-center text-3xl font-bold ">Prestamos</p>
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
                        <div className="flex justify-center items-center h-52">
                            <p className="mt-10 font-bold text-gray-500">No hay solicitudes todavia.</p>
                        </div>
                        :
                        filteredData.length === 0 ?
                            <div className="flex justify-center items-center h-52">
                                <p className="mt-10 font-bold text-gray-500">
                                    Sin resultados.
                                </p>
                            </div> :
                            <Table
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
                                        className="text-center flex justify-center items-center font-bold text-sm w-96 cursor-pointer"
                                        key="alumno"
                                        onClick={() => {
                                            requestSort('alumno');
                                            setAlumnoArrow(!alumnoArrow);
                                        }
                                        }
                                    >
                                        Alumno {alumnoArrow ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                    </TableColumn>
                                    <TableColumn
                                        className="text-center font-bold text-sm cursor-pointer"
                                        key="nombrePractica"
                                        onClick={() => {
                                            requestSort('nombrePractica');
                                            setPracticaArrow(!practicaArrow);
                                        }}
                                    >
                                        <p className="flex justify-center items-center">Practica {practicaArrow ? <IoIosArrowUp /> : <IoIosArrowDown />}</p>
                                    </TableColumn>
                                    <TableColumn
                                        className="text-center font-bold text-sm cursor-pointer"
                                        key="fechaMaterialRequerido"
                                        onClick={() => {
                                            requestSort('fechaMaterialRequerido');
                                            setFechaArrow(!fechaArrow);
                                        }}
                                    >
                                        <p className="flex justify-center items-center">
                                            Fecha {fechaArrow ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                        </p>
                                    </TableColumn>
                                    <TableColumn
                                        className="text-center font-bold text-sm"
                                        key="horaMaterialRequerido"
                                    >
                                        Hora
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
                                        <TableRow key={item._id} className="">
                                            {(columnKey) => (
                                                columnKey === 'acciones' ? (
                                                    <TableCell className="text-center flex gap-2 justify-center">

                                                        <Button  isIconOnly variant="flat">
                                                            {
                                                                <ModalLoans id={item._id} />
                                                            }
                                                        </Button>
                                                        <Button  isIconOnly color="warning" variant="flat">
                                                            {
                                                                <ModalDeleteItem texto={`
                                                                    Estas apunto de eliminar la solicitud ${item?.nombrePractica} del alumno ${item?.alumno?.nombre}
                                                                    `} id={item._id}
                                                                    handleFunction={handleDelete}
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

export default LoansList;
