import Logo from "../assets/images/procesos_alimentarios-removebg-preview.png";
import { styles } from '../assets/styles/global-styles';
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useAuth } from "../context/auth-context";
const NavBar = () => {
  const [flag, setFlag] = useState(false);
  const { signOut } = useAuth();
  return (
    <nav className=' sm:px-20 px-10 flex flex-row justify-between items-center min-h-20  '
      style={{ backgroundColor: styles.backegroundNav }}>
      <div>
        <img
          src={Logo}
          alt="logo"
          className='sm:flex hidden w-20 h-20  object-contain'
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
            <NavLink to={"/cambiar-password"}>Cambiar contraseña</NavLink>
            <NavLink to={"/solicitar-material"}>Solicitar Materiales</NavLink>
            <button onClick={signOut} className="p-2 rounded-md" style={{ backgroundColor: styles.backgroundOrange }}>Cerrar sesion</button>
          </div>
        </div>
      )}

      <div className="text-white font-medium sm:flex hidden sm:gap-4 flex-row md:gap-5 lg:gap-16 items-center sm:text-xs md:text-[16px]">
        <NavLink to={"/inicio"}>Inicio</NavLink>
        <NavLink to={"/cambiar-password"}>Cambiar contraseña</NavLink>
        <NavLink to={"/solicitar-material"}>Solicitar Materiales</NavLink>
        <button onClick={signOut} className="p-2 rounded-md" style={{ backgroundColor: styles.backgroundOrange }}>Cerrar sesion</button>
      </div>
    </nav>
  );
}

export default NavBar;
