import axios from "./axios"

export const getAllAlumnos = (token) => axios.get("/alumnos", {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const createAlumno = (data,token) => axios.post("/alumnos", data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const getAlumnoById = (id,token) => axios.get(`/alumnos/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
})

export const updateAlumno = (id, data,token) => axios.patch(`/alumnos/${id}`, data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const deleteAlumno = (id,token) => axios.delete(`/alumnos/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});