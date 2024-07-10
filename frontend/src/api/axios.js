import axios from "axios";

const instance = axios.create({
    baseURL : "https://procesos-oe2e15s7z-reyesrivera21s-projects.vercel.app",
    withCredentials: true,
})

export default instance;