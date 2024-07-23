import Logo from "../assets/images/procesos_alimentarios-removebg-preview.png";
import { styles } from '../assets/styles/global-styles';
import { NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useAuth } from "../context/auth-context";
import {  Navbar } from "@nextui-org/react";
const NavBarDocente = () => {
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
                    className='sm:flex hidden md:w-20 md:h-20 sm:w-14 sm:h-14 object-contain'
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
                        <NavLink to={"/inicio-docente"}>Inicio</NavLink>
                        <NavLink to={"/cambiar-pass-docente"}>Cambiar contraseña</NavLink>
                        <NavLink to={"/crear-practica"}>Nueva práctica</NavLink>
                        <NavLink to={"/practicas-docente"}>Prácticas</NavLink>
                        <button onClick={signOut} className="p-2 rounded-md" style={{ backgroundColor: styles.backgroundOrange }}>Cerrar sesión</button>
                    </div>
                </div>
            )}
            <div className="text-white font-medium sm:flex hidden sm:gap-4 flex-row md:gap-5 lg:gap-16 items-center sm:text-xs md:text-[16px]  ">

                <NavLink to={"/inicio-docente"}>Inicio</NavLink>
                <NavLink to={"/cambiar-pass-docente"}>Cambiar contraseña</NavLink>
                <NavLink to={"/crear-practica"}>Nueva práctica</NavLink>
                <NavLink to={"/practicas-docente"}>Prácticas</NavLink>
                <button
                    onClick={signOut}
                    className="p-2 rounded-md sm:text-xs md:text-[16px]"
                    style={{ backgroundColor: styles.backgroundOrange }}>
                    Cerrar sesión
                </button>
            </div>
        </Navbar>
    );
}

export default NavBarDocente;
