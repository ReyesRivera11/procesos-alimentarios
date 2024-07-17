import axios from "./axios";

export const getAllProfesores = (token) => axios.get("/profesores", {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const createProfesor = (data, token) => axios.post("/profesores", data, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const getProfesorById = (id, token) => axios.get(`/profesores/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const updateProfesor = (id, data, token) => axios.patch(`/profesores/${id}`, data, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const deleteProfesor = (id, token) => axios.delete(`/profesores/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});