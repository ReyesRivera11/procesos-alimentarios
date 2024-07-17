import axios from "./axios";

export const createAsignatura = (data,token) => axios.post("/asignaturas", data, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const getAllAsignaturas = (token) => axios.get("/asignaturas");

export const getAsignaturaById = (id, token) => axios.get(`/asignaturas/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const updateAsignatura = (id, data, token) => axios.patch(`/asignaturas/${id}`, data, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const deleteAsignatura = (id,token) => axios.delete(`/asignaturas/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});