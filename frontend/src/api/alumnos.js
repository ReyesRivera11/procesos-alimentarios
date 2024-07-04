import axios from "./axios"

export const getAllAlumnos = () => axios.get("/alumnos");

export const createAlumno = (data) => axios.post("/alumnos",data);

export const getAlumnoById = (id) => axios.get(`/alumnos/${id}`)

export const updateAlumno = (id,data) => axios.patch(`/alumnos/${id}`,data);

export const deleteAlumno = (id) => axios.delete(`/alumnos/${id}`);