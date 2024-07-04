import Logo from "../assets/images/procesos_alimentarios-removebg-preview.png";
import { styles } from '../assets/styles/global-styles';
import { NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useAuth } from "../context/auth-context";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarItem } from "@nextui-org/react";
const NavBarAdmin = () => {
    const [flag, setFlag] = useState(false);
    const { signOut } = useAuth();
    const navigate = useNavigate();
    return (
        <Navbar className=' sm:px-20 px-10 flex flex-row justify-center items-center sm:min-h-20  '
            style={{ backgroundColor: styles.backegroundNav }}>
            <div>
                <img
                    src={Logo}
                    alt="logo"
                    className='sm:flex hidden md:w-20 md:h-20 sm:w-full sm:h-full object-contain'
                />
                <button className="flex sm:hidden" onClick={() => setFlag(true)}>
                    <GiHamburgerMenu className="text-white text-3xl" />
                </button>
            </div>

            {flag && (
                <div className="w-full h-lvh flex sm:hidden flex-col fixed left-0 top-0 font-medium z-50" style={{ backgroundColor: styles.backegroundNav }}>
                    <button className="flex sm:hidden mt-16 ml-10" onClick={() => setFlag(false)}>
                        <IoIosCloseCircle className="text-white text-3xl" />
                    </button>
                    <div className="flex flex-col items-center gap-10 text-white" onClick={() => setFlag(false)}>
                        <NavLink to={"/inicio"}>Inicio</NavLink>
                        <NavLink to={"/asignaturas"}>Asignaturas</NavLink>
                        <NavLink to={"/docentes"}>Docentes</NavLink>
                        <NavLink to={"/alumnos"}>Alumnos</NavLink>
                        <Dropdown>
                            <NavbarItem>
                                <DropdownTrigger>
                                    <Button
                                        disableRipple
                                        className="p-0 sm:text-xs md:text-[16px] bg-transparent data-[hover=true]:bg-transparent font-bold"
                                        // radius="sm"
                                        variant="dark"
                                    >
                                        Materiales
                                    </Button>
                                </DropdownTrigger>
                            </NavbarItem>
                            <DropdownMenu
                                aria-label="ACME features"
                                className="w-[200px]"
                                itemClasses={{
                                    base: "gap-4",
                                }}
                            >
                                <DropdownItem onClick={() => {
                                    navigate("/aditivos");
                                    setFlag(false);
                                }}>
                                    Aditivos
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                    navigate("/materialesLab");
                                    setFlag(false);
                                }}>
                                    Materiales de laboratorio
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                    navigate("/materialesAlmacen");
                                    setFlag(false);
                                }}>
                                    Materiales de almacen
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                    navigate("/equipos-taller");
                                    setFlag(false);

                                }}>
                                    Equipos taller
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                    navigate("/equipos-lab");
                                    setFlag(false);
                                }}>
                                    Equipos laboratorio
                                </DropdownItem>

                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                            <NavbarItem>
                                <DropdownTrigger>
                                    <Button
                                        disableRipple
                                        className="p-0 sm:text-xs md:text-[16px] bg-transparent data-[hover=true]:bg-transparent font-bold"
                                        // radius="sm"
                                        variant="dark"
                                    >
                                        Prestamos
                                    </Button>
                                </DropdownTrigger>
                            </NavbarItem>
                            <DropdownMenu
                                aria-label="ACME features"
                                className="w-[200px]"
                                itemClasses={{
                                    base: "gap-4",
                                }}
                            >
                                <DropdownItem onClick={() => {
                                    navigate("/prestamos");
                                    setFlag(false);
                                }}>
                                    Todos
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                    navigate("/solicitar-material");
                                    setFlag(false);
                                }} >
                                    Por Aceptar
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                    navigate("/entregas");
                                    setFlag(false);
                                }} >
                                    Por entregar
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                    navigate("/devoluciones");
                                    setFlag(false);
                                }}>
                                    Por devolver
                                </DropdownItem>

                            </DropdownMenu>
                        </Dropdown>

                        <button onClick={signOut} className="p-2 rounded-md" style={{ backgroundColor: styles.backgroundOrange }}>Cerrar sesion</button>
                    </div>
                </div>
            )}
            <div className="text-white font-medium sm:flex hidden sm:gap-4 flex-row md:gap-5 lg:gap-16 items-center sm:text-xs md:text-[16px]  ">
                <NavLink to={"/asignaturas"}>Asignaturas</NavLink>
                <NavLink to={"/docentes"}>Docentes</NavLink>
                <NavLink to={"/alumnos"}>Alumnos</NavLink>
                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="p-0 sm:text-xs md:text-[16px] bg-transparent data-[hover=true]:bg-transparent font-bold"
                                variant="dark"
                            >
                                Materiales
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="ACME features"
                        className="w-[200px]"
                        itemClasses={{
                            base: "gap-4",
                        }}
                    >
                        <DropdownItem onClick={() => navigate("/aditivos")}>
                            Aditivos
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate("/materialesLab")}>
                            Materiales de laboratorio
                        </DropdownItem> /equipos-taller
                        <DropdownItem onClick={() => navigate("/materialesAlmacen")}>
                            Materiales de almacen
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate("/equipos-taller")}>
                            Equipos taller
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate("/equipos-lab")}>
                            Equipos laboratorio
                        </DropdownItem>

                    </DropdownMenu>
                </Dropdown>

                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="p-0 sm:text-xs md:text-[16px] bg-transparent data-[hover=true]:bg-transparent font-bold"
                                // radius="sm"
                                variant="dark"
                            >
                                Prestamos
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="ACME features"
                        className="w-[200px]"
                        itemClasses={{
                            base: "gap-4",
                        }}
                    >
                        <DropdownItem onClick={() => navigate("/prestamos")}>
                            Todos
                        </DropdownItem>

                        <DropdownItem onClick={() => navigate("/solicitudes")}>
                            Por aceptar
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate("/entregas")}>
                            Por entregar
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate("/devoluciones")}>
                            Por devolver
                        </DropdownItem>


                    </DropdownMenu>
                </Dropdown>

                <button
                    onClick={signOut}
                    className="p-2 rounded-md sm:text-xs md:text-[16px]"
                    style={{ backgroundColor: styles.backgroundOrange }}>
                    Cerrar sesion
                </button>
            </div>
        </Navbar>
    );
}

export default NavBarAdmin;
