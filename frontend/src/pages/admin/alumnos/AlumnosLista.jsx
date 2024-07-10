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
const AlumnosLista = () => {
    const [data, setData] = React.useState([]);
    const [loaded, setLoaded] = React.useState(true);
    const [filteredData, setFilteredData] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [filterValue, setFilterValue] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState("default");
    const [groupFilter, setGroupFilter] = React.useState("all");
    const [semesterFilter, setSemesterFilter] = React.useState("all");
    const navigate = useNavigate();
    const rowsPerPage = 10;
    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredData.slice(start, end);
    }, [page, filteredData]);

    useEffect(() => {
        const getAlumnos = async () => {
            const res = await getAllAlumnos();
            if (res) {
                setLoaded(false);
                setData(res.data);
                setFilteredData(res.data);
            }
            setLoaded(false);
        };
        getAlumnos();
    }, []);

    useEffect(() => {
        const lowercasedFilter = filterValue.toLowerCase();
        const filteredAndSortedData = data
            .filter(item => item?.nombre.toLowerCase().includes(lowercasedFilter))
            .filter(item => groupFilter === "all" || item?.grupo === groupFilter)
            .filter(item => semesterFilter === "all" || item?.cuatrimestre.toLowerCase() === semesterFilter.toLocaleLowerCase());

        if (sortOrder === "asc") {
            filteredAndSortedData.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else if (sortOrder === "desc") {
            filteredAndSortedData.sort((a, b) => b.nombre.localeCompare(a.nombre));
        }

        setFilteredData(filteredAndSortedData);
        setPage(1);
    }, [filterValue, data, sortOrder, groupFilter, semesterFilter]);

    const onSearchChange = React.useCallback((e) => {
        const { value } = e.target;
        setFilterValue(value);
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);


    const handleDelete = async (id) => {
        try {
            const res = await deleteAlumno(id);
            if (res) {
                toast.success("Alumno eliminado correctamente.");
                setData(data.filter(item => item._id !== id));
            }
        } catch (error) {
            console.log(error);
        }
    };

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

    return (
        <div className='w-full sm:p-5 sm:px-20 p-5'>
            <Toaster richColors />
            <div className="w-full mb-2">
                <div className="flex md:flex-row flex-col justify-between items-center max-w-[900px] m-auto gap-3">
                    <div className="flex md:flex-row flex-col w-full md:gap-10 gap-3">
                        <p className="text-center text-2xl font-bold ">Alumnos</p>
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
                            <DropdownTrigger className="hidden sm:flex">
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
                            <DropdownTrigger>
                                <Button variant="flat">
                                    <Tooltip content="Filtrar por grupo">
                                        <span>
                                            <BsAlphabetUppercase className="text-xl" />
                                        </span>
                                    </Tooltip>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Filtrar por grupo"
                                closeOnSelect={true}
                                selectionMode="single"
                                selectedKeys={new Set([groupFilter])}
                                onSelectionChange={(key) => setGroupFilter(Array.from(key).join(""))}
                            >

                                {grupos.map(item => item === "all" ?
                                    <DropdownItem key={item}>
                                        Todos
                                    </DropdownItem> : <DropdownItem key={item}>
                                        {item}
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="flat">
                                    <Tooltip content="Filtrar por cuatrimestre">
                                        <span>
                                            <SiLevelsdotfyi className="text-xl" />
                                        </span>
                                    </Tooltip>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                className="overflow-y-scroll max-h-96"
                                aria-label="Filtrar por cuatrimestre"
                                closeOnSelect={true}
                                selectionMode="single"
                                selectedKeys={new Set([semesterFilter])}
                                onSelectionChange={(key) => setSemesterFilter(Array.from(key).join(""))}
                            >
                                {niveles.map(item => item === "all" ?
                                    <DropdownItem key={item}>
                                        Todos
                                    </DropdownItem> : <DropdownItem key={item}>
                                        {item}
                                    </DropdownItem>
                                )}

                            </DropdownMenu>
                        </Dropdown>
                        <Button type="button" className="" variant="flat" onClick={() => navigate("/agregar-alumno")} >
                            <Tooltip content="Agregar">
                                <span>
                                    <IoMdAdd className=" text-2xl " />
                                </span>
                            </Tooltip>
                        </Button>
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
                                <p className="mt-10 font-bold text-gray-500">No hay alumnos registrados todavia.</p>
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
                                        Matricula
                                    </TableColumn>
                                    <TableColumn className="text-center font-bold">
                                        Nombre
                                    </TableColumn>
                                    <TableColumn className="text-center font-bold">
                                        Grupo
                                    </TableColumn>
                                    <TableColumn className="text-center font-bold">
                                        Cuatrimestre
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
                                                {item.matricula}
                                            </TableCell>
                                            <TableCell className=" text-xs sm:text-sm">
                                                {item.nombre}
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm text-center">
                                                {item.grupo}
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm text-center uppercase">
                                                {item.cuatrimestre}
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm text-center">
                                                {item.estado ? "ACTIVO" : "INACTIVO"}
                                            </TableCell>
                                            <TableCell className="flex justify-around gap-2">
                                                <Button
                                                    className="text-xl"
                                                    isIconOnly
                                                    color="primary"
                                                    variant="flat"
                                                    onClick={()=>navigate(`/editar-alumno/${item._id}`)}
                                                >
                                                    <Tooltip className="bg-blue-500 text-white" content="Editar">
                                                        <span>
                                                            <CiEdit />
                                                        </span>
                                                    </Tooltip>
                                                </Button>
                                                <Button
                                                    className="text-xl"
                                                    isIconOnly
                                                    color="warning"
                                                    variant="flat"
                                                >
                                                    <ModalDeleteItem
                                                        id={item._id}
                                                        handleFunction={handleDelete}
                                                        texto={`
                                                                Estas apunto de eliminar al alumno ${item.nombre}.
                                                            `
                                                        }
                                                    />
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

export default AlumnosLista;
