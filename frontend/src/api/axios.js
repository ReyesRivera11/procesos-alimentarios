import axios from "axios";

const instance = axios.create({
    // baseURL:"http://localhost:3000",
    baseURL : "https://procesos-alimentarios-eosin.vercel.app",
    withCredentials: true,
})

export default instance; 