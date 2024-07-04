import axios from "./axios";

export const getAditivos = () => axios.get("/aditivos");

export const getMatLaboratorio = () => axios.get("/material-lab");

export const getMatAlmacen = () => axios.get("/material-inventario");

export const getAllDocentes = () => axios.get("/profesores");

export const getAllMaterias = () => axios.get("/asignaturas");

export const getAllLaboratorio = () => axios.get("/equipos-lab");