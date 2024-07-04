import axios from "./axios";

export const getAllProfesores = () => axios.get("/profesores");

export const createProfesor = (data) => axios.post("/profesores",data);

export const getProfesorById = (id) => axios.get(`/profesores/${id}`);

export const updateProfesor = (id,data) => axios.patch(`/profesores/${id}`,data);

export const deleteProfesor = (id) => axios.delete(`/profesores/${id}`);