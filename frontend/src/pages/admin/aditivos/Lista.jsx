import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Tooltip, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import React, { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Toaster, toast } from 'sonner';
import { CircularProgress } from "@nextui-org/react";
import { deleteAditivo, getAllAditivos } from "../../../api/materiales";
import { CiEdit } from "react-icons/ci";
import ModalDeleteItem from "../../../components/ModalDeleteItem";
import { IoMdAdd } from "react-icons/io";
import { GoListOrdered } from "react-icons/go";
import {useNavigate} from "react-router-dom"
const Lista = () => {
    const [data, setData] = React.useState([]);
    const [loaded, setLoaded] = React.useState(true);
    const [filteredData, setFilteredData] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [filterValue, setFilterValue] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState("default");
    const navigate = useNavigate();
    const rowsPerPage = 10;
    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredData.slice(start, end);
    }, [page, filteredData]);

    useEffect(() => {
        const getAditivos = async () => {
            const res = await getAllAditivos();
            if (res) {
                setLoaded(false);
                setData(res.data);
                setFilteredData(res.data);
            }
            setLoaded(false);
        };
        getAditivos();
    }, []);

    useEffect(() => {
        const lowercasedFilter = filterValue.toLowerCase();
        const filteredAndSortedData = data
            .filter(item => item?.nombre.toLowerCase().includes(lowercasedFilter));

        if (sortOrder === "asc") {
            filteredAndSortedData.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else if (sortOrder === "desc") {
            filteredAndSortedData.sort((a, b) => b.nombre.localeCompare(a.nombre));
        }

        setFilteredData(filteredAndSortedData);
        setPage(1);
    }, [filterValue, data, sortOrder]);

    const onSearchChange = React.useCallback((e) => {
        const { value } = e.target;
        setFilterValue(value);
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const getKeyValue = (item, columnKey) => {
        return item[columnKey];
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteAditivo(id);
            if (res) {
                toast.success("Aditivo eliminado correctamente.");
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
                <div className="flex sm:flex-row flex-col justify-between items-center max-w-[900px] m-auto gap-3">
                    <div className="flex sm:flex-row flex-col w-full sm:gap-10 gap-3">
                        <p className="text-center text-2xl font-bold ">Aditivos</p>
                        <Input
                            isClearable
                            placeholder="Buscar"
                            startContent={<CiSearch />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onChange={onSearchChange}
                        />
                    </div>
                    <div className="flex items-center w-full justify-end gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="flat">
                                    <Tooltip content="Ordenar">
                                        <span>
                                            <GoListOrdered />
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
                        <Button className="" variant="flat" onClick={()=>navigate("/agregar-aditivo")} >
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
                                <p className="mt-10 font-bold text-gray-500">No cuentas con ningun aditivo.</p>
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
                                    <TableColumn
                                        className="text-center font-bold text-sm w-96"
                                        key="nombre"
                                    >
                                        Aditivo
                                    </TableColumn>
                                    <TableColumn
                                        className="text-center font-bold text-sm"
                                        key="cantidad"
                                    >
                                        Cantidad
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
                                                        <Button isIconOnly variant="flat" color="primary" 
                                                            onClick={()=>navigate(`/editar-aditivo/${item._id}`)}
                                                        >
                                                            <Tooltip content="Editar" className="text-white bg-blue-500">
                                                                <span>
                                                                    <CiEdit className="text-2xl" />
                                                                </span>
                                                            </Tooltip>
                                                        </Button>
                                                        <Button isIconOnly color="warning" variant="flat">
                                                            {
                                                                <ModalDeleteItem
                                                                    handleFunction={handleDelete}
                                                                    id={item?._id}
                                                                    texto={`El aditivo ${item?.nombre} será eliminado.`}
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

export default Lista;
