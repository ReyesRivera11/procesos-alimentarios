import axios from "./axios";


export const getAllLoansApi = (token) => axios.get("/prestamos", {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const createLoans = (data, token) => axios.post("/prestamos", data, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const getLoansById = (id, token) => axios.get(`/prestamos/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const getLoansByAlumno = (id, token) => axios.get(`/prestamos/prestamos-alumno/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const getAllRequests = (token) => axios.get(`/prestamos/get-requests`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const requestsVal = (data,token) => axios.put(`/prestamos/accept-request`, data, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const getAllLoansToDeliver = (token) => axios.get(`/prestamos/get-not-deliveries`, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const acceptDelivery = (data,token) => axios.put(`/prestamos/confirm-delivery`, data, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const getAllLoansToReturn = (token) => axios.get("/prestamos/get-not-return", {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const confirmReturn = (data,token) => axios.put(`/prestamos/confirm-return`, data, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});

export const deleteLoan = (id,token) => axios.delete(`/prestamos/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`,
    }
});
