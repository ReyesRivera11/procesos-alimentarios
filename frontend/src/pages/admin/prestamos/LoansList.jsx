import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Tooltip, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import React, { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Toaster, toast } from 'sonner';
import { CircularProgress } from "@nextui-org/react";
import { BsAlphabetUppercase } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import ModalDeleteItem from "../../../components/ModalDeleteItem";
import { IoMdAdd } from "react-icons/io";
import { GoListOrdered } from "react-icons/go";
import { deleteAlumno, getAllAlumnos } from "../../../api/alumnos";
import { SiLevelsdotfyi } from "react-icons/si";
import { grupos, niveles } from "../../../data/cuatrimestre-grupo";
import { useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { getAllLoansApi, getLoansByAlumno } from "../../../api/loans";
import { useAuth } from "../../../context/auth-context";
import ModalLoans from "../../../components/ModalLoans";
import { BsCalendar2Date } from "react-icons/bs";
const LoanList = () => {
    const { user,token } = useAuth();
    const [data, setData] = React.useState([]);
    const [loaded, setLoaded] = React.useState(true);
    const [filteredData, setFilteredData] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [filterValue, setFilterValue] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState("default");
    const [sortOrderDate, setSortOrderDate] = React.useState("default");
    const rowsPerPage = 10;
    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredData.slice(start, end);
    }, [page, filteredData]);
    useEffect(() => {
        const getSolicitudes = async () => {
            const res = await getAllLoansApi(token);
            if (res) {
                setLoaded(false);
                setData(res.data);
                setFilteredData(res.data);
            }
            setLoaded(false);
        };
        getSolicitudes();
    }, []);

    useEffect(() => {
        const lowercasedFilter = filterValue.toLowerCase();
        const filteredAndSortedData = data
            .filter(item => item?.nombrePractica?.toLowerCase().includes(lowercasedFilter))
        
        if (sortOrder === "asc") {
            filteredAndSortedData.sort((a, b) => a?.nombrePractica.localeCompare(b.nombre));
        } else if (sortOrder === "desc") {
            filteredAndSortedData.sort((a, b) => b?.nombrePractica.localeCompare(a.nombre));
        }   
        if (sortOrderDate !== "default") {
            filteredAndSortedData.sort((a, b) => {
                const dateA = new Date(a?.fecha.split('/').reverse().join('-'));
                const dateB = new Date(b?.fecha.split('/').reverse().join('-'));
                return sortOrderDate === "asc" ? dateA - dateB : dateB - dateA;
            });
        }

        setFilteredData(filteredAndSortedData);
        setPage(1);
    }, [filterValue, data, sortOrder,sortOrderDate]);

    const onSearchChange = React.useCallback((e) => {
        const { value } = e.target;
        setFilterValue(value);
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);


    const handleSortChange = (key) => {
        const selectedKey = Array.from(key).join("");
        if (selectedKey === "ascendente") {
            setSortOrder("asc");
        } else if (selectedKey === "descendiente") {
            setSortOrder("desc");
        } else {
            setSortOrder("default");
        }
    };
    const handleSortChangeDate = (key) => {
        const selectedKey = Array.from(key).join("");
        if (selectedKey === "ascendente") {
            setSortOrderDate("asc");
        } else if (selectedKey === "descendiente") {
            setSortOrderDate("desc");
        } else {
            setSortOrderDate("default");
        }
    };

    return (
        <div className='w-full sm:p-5 sm:px-20 p-5'>
            <Toaster richColors />
            <div className="w-full mb-2">
                <div className="flex md:flex-row flex-col justify-between items-center max-w-[900px] m-auto gap-3">
                    <div className="flex md:flex-row flex-col w-full md:gap-10 gap-3">
                        <p className="text-center text-2xl font-bold ">Solicitudes</p>
                        <Input
                            isClearable
                            placeholder="Buscar"
                            startContent={<CiSearch />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onChange={onSearchChange}
                        />
                    </div>
                    <div className="flex w-full md:max-w-[900px] justify-end mx-auto my-2 gap-3">
                        <Dropdown>
                            <DropdownTrigger className=" sm:flex">
                                <Button variant="flat">
                                    <Tooltip content="Ordenar">
                                        <span>
                                            <GoListOrdered className="text-xl" />
                                        </span>
                                    </Tooltip>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={true}
                                selectionMode="single"
                                selectedKeys={new Set([sortOrder === "asc" ? "ascendente" : sortOrder === "desc" ? "descendiente" : "default"])}
                                onSelectionChange={(key) => handleSortChange(key)}
                            >
                                <DropdownItem key="default">
                                    Por defecto
                                </DropdownItem>
                                <DropdownItem key="ascendente">
                                    Ascendente
                                </DropdownItem>
                                <DropdownItem key="descendiente">
                                    Descendente
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                            <DropdownTrigger className=" sm:flex">
                                <Button variant="flat">
                                    <Tooltip content="Ordenar por fecha de solicitud">
                                        <span>
                                            <BsCalendar2Date className="text-xl" />
                                        </span>
                                    </Tooltip>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={true}
                                selectionMode="single"
                                selectedKeys={new Set([sortOrderDate === "asc" ? "ascendente" : sortOrderDate === "desc" ? "descendiente" : "default"])}
                                onSelectionChange={(key) => handleSortChangeDate(key)}
                            >
                                <DropdownItem key="default">
                                    Por defecto
                                </DropdownItem>
                                <DropdownItem key="ascendente">
                                    Ascendente
                                </DropdownItem>
                                <DropdownItem key="descendiente">
                                    Descendente
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                       
                    </div>

                </div>

            </div>
            {
                loaded ? <div className="w-full h-52 flex justify-center items-center">
                    <CircularProgress size="lg" color="warning" aria-label="Loading..." />
                </div> :
                    data.length === 0 ?
                        (
                            <div className="flex justify-center items-center h-52">
                                <p className="mt-10 font-bold text-gray-500">No hay solicitudes todavia.</p>
                            </div>
                        ) : filteredData.length === 0 ?
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
                                            onChange={(page) => {
                                                setPage(page);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        />
                                    </div>
                                }
                                className="h-full max-w-[900px] mx-auto"
                            >
                                <TableHeader >
                                    <TableColumn className="text-center font-bold">
                                        Practica
                                    </TableColumn>
                                    <TableColumn className="text-center font-bold">
                                        Fecha de solicitud
                                    </TableColumn>
                                    <TableColumn className="text-center font-bold">
                                        Fecha requerida
                                    </TableColumn>
                                    <TableColumn className="text-center font-bold">
                                        Hora
                                    </TableColumn>
                                    <TableColumn className="text-center font-bold">
                                        Estado
                                    </TableColumn>
                                    <TableColumn className="text-center font-bold">
                                        Acciones
                                    </TableColumn>
                                </TableHeader>
                                <TableBody >
                                    {items.map((item, index) => (
                                        <TableRow key={index} className="text-sm">
                                            <TableCell className=" text-xs sm:text-sm">
                                                {item?.nombrePractica}
                                            </TableCell>
                                            <TableCell className=" text-xs sm:text-sm text-center">
                                                {item?.fecha}
                                            </TableCell>
                                            <TableCell className=" text-xs sm:text-sm text-center">
                                                {item?.fechaMaterialRequerido}
                                            </TableCell>

                                            <TableCell className="text-xs sm:text-sm text-center">
                                                {item?.horaMaterialRequerido}
                                            </TableCell>

                                            <TableCell className="text-xs sm:text-sm text-center">
                                                {item?.aceptado ? item?.aceptado ? 
                                                (<span className="flex items-center justify-center" >
                                                    <GoDotFill className="text-green-500 font-bold" /> Aceptada
                                                </span>) : 
                                                (<span className="flex items-center justify-center" >
                                                   <GoDotFill className="text-red-500 font-bold" /> Rechazada
                                                </span>):(
                                                    <span className="flex items-center justify-center" >
                                                    <GoDotFill className="text-yellow-500 font-bold" /> Pendiente
                                                 </span>
                                                ) }
                                            </TableCell>

                                            <TableCell className="text-center flex gap-2 justify-center">

                                                <Button isIconOnly variant="flat">
                                                    {
                                                        <ModalLoans id={item._id} />
                                                    }
                                                </Button>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
            }
        </div>
    );
};

export default LoanList;
