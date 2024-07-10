import axios from "axios";

const instance = axios.create({
    baseURL : "https://procesos-alimentarios-eosin.vercel.app",
    withCredentials: true,
})

export default instance; 