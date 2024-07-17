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
import { deleteAlumno } from "../../../api/alumnos";
import { AiOutlineBars } from "react-icons/ai";
import { SiLevelsdotfyi } from "react-icons/si";
import { grupos, niveles } from "../../../data/cuatrimestre-grupo";
import { useNavigate } from "react-router-dom";
import { deleteEquipoTaller, getAllEquipoTaller } from "../../../api/materiales";
import { useAuth } from "../../../context/auth-context";
const EquiposTaller = () => {
    const [data, setData] = React.useState([]);
    const [loaded, setLoaded] = React.useState(true);
    const [filteredData, setFilteredData] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [filterValue, setFilterValue] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState("default");
    const [estado, setestado] = React.useState("all");
    const [enUso, setenUso] = React.useState("all");
    const {token} = useAuth();
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
            const res = await getAllEquipoTaller();
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
            .filter(item => estado === "all" || item?.estado === estado)
            .filter(item => enUso === "all" || item?.enUso.toString() == enUso);

        if (sortOrder === "asc") {
            filteredAndSortedData.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else if (sortOrder === "desc") {
            filteredAndSortedData.sort((a, b) => b.nombre.localeCompare(a.nombre));
        }

        setFilteredData(filteredAndSortedData);
        setPage(1);
    }, [filterValue, data, sortOrder, estado, enUso]);

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
            const res = await deleteEquipoTaller(id,token);
            if (res) {
                toast.success("Equipo eliminado correctamente.");
                setData(data.filter(item => item._id !== id));
            }
        } catch (error) {
            toast.error(error.response.data.message)
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
                    <div className="flex md:flex-row flex-col w-full md:gap-10 gap-3 items-center">
                        <p className="text-center text-2xl font-bold ">Equipos Taller</p>
                        <Input
                            isClearable
                            className="w-full md:max-w-[300px]"
                            placeholder="Buscar"
                            startContent={<CiSearch />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onChange={onSearchChange}
                        />
                    </div>
                    <div className="flex w-full md:max-w-[900px] justify-end mx-auto my-2 gap-2">
                        <Dropdown>
                            <DropdownTrigger>
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
                                    <Tooltip content="Filtrar por estado">
                                        <span>
                                            <AiOutlineBars className="text-xl" />
                                        </span>
                                    </Tooltip>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Filtrar por estado"
                                closeOnSelect={true}
                                selectionMode="single"
                                selectedKeys={new Set([estado])}
                                onSelectionChange={(key) => setestado(Array.from(key).join(""))}
                            >

                                <DropdownItem key={"all"}>
                                    Todo
                                </DropdownItem>

                                <DropdownItem key={"ACTIVO"}>
                                    Activo
                                </DropdownItem>
                                <DropdownItem key={"INACTIVO"}>
                                    Inactivo
                                </DropdownItem>

                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="flat">
                                    <Tooltip content="Filtrar por uso">
                                        <span>
                                            <SiLevelsdotfyi className="text-xl" />
                                        </span>
                                    </Tooltip>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Filtrar por uso"
                                closeOnSelect={true}
                                selectionMode="single"
                                selectedKeys={new Set([enUso])}
                                onSelectionChange={(key) => setenUso(Array.from(key).join(""))}
                            >

                                <DropdownItem key={"all"}>
                                    Todos
                                </DropdownItem>
                                <DropdownItem key={"true"}>
                                    En uso
                                </DropdownItem>
                                <DropdownItem key={"false"}>
                                    Libre
                                </DropdownItem>

                            </DropdownMenu>
                        </Dropdown>
                        <Button className="" variant="flat" onClick={() => navigate("/agregar-equipo-taller")} >
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
                                <p className="mt-10 font-bold text-gray-500">No hay equipos registrados todavia.</p>
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
                                        Nombre
                                    </TableColumn>
                                    <TableColumn className="text-center font-bold">
                                        Estado
                                    </TableColumn>
                                    <TableColumn className="text-center font-bold">
                                        En uso
                                    </TableColumn>

                                    <TableColumn className="text-center font-bold">
                                        Acciones
                                    </TableColumn>
                                </TableHeader>
                                <TableBody >
                                    {items.map((item, index) => (
                                        <TableRow key={index} className="text-sm">
                                            <TableCell className=" text-xs sm:text-sm">
                                                {item.nombre}
                                            </TableCell>
                                            <TableCell className=" text-xs sm:text-sm text-center">
                                                {item.estado}
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm text-center">
                                                {item.enUso ? "EN USO" : "LIBRE"}
                                            </TableCell>

                                            <TableCell className="flex justify-around gap-2">
                                                <Button
                                                    className="text-xl"
                                                    isIconOnly
                                                    color="primary"
                                                    variant="flat"
                                                    onClick={()=>navigate(`/editar-equipo-taller/${item._id}`)}
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
                                                                Estas apunto de eliminar el equipo ${item.nombre}.
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

export default EquiposTaller;
