import Uthh from "../assets/images/uthh-logo.png";
import Escudo from "../assets/images/escudo-hidalgo.png";
import { styles } from "../assets/styles/global-styles";

const Header = () => {
  const { backgroundBeige } = styles;
  return (
    <>
      <div
        style={{ backgroundColor: backgroundBeige }}
        className={`w-full h-16 p-2 flex justify-center md:gap-20 gap-5`}>
        <img src={Uthh} alt="Logo uthh" className="md:w-[400px] w-52 object-contain " />
        <img src={Escudo} alt="Escudo Hidalgo" />
      </div>
    </>
   
  )
}

export default Header