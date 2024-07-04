import axios from "./axios";

export const createAsignatura = (data) => axios.post("/asignaturas",data);

export const getAllAsignaturas = () => axios.get("/asignaturas");

export const getAsignaturaById = id => axios.get(`/asignaturas/${id}`);

export const updateAsignatura = (id,data) => axios.patch(`/asignaturas/${id}`,data);

export const deleteAsignatura = (id) => axios.delete(`/asignaturas/${id}`);