import axios from "./axios";

export const crearPractica = (data) => axios.post("/practicas", data);

export const updatePractica = (id, data, token) => axios.patch(`/practicas/${id}`, data, {
    params: data, headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const getPracticas = () => axios.get("/practicas");

export const getPracticasById = (id) => axios.get(`/practicas/${id}`);

export const deletePractica = (id) => axios.delete(`/practicas/${id}`);

export const updateEstado = (id, data,token) => axios.patch(`/practicas/update-estado/${id}`, data, {
    params: data, headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const getPracticasDocente = (id) => axios.get(`/practicas/practicas-docente/${id}`);

export const practicasDisponibles = (data, token) => axios.get("/practicas/practicas-disponibles", {
    params: data, headers: {
        "Authorization": `Bearer ${token}`
    }
});

