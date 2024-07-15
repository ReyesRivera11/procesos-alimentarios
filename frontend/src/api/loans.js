import axios from "./axios";


export const getAllLoansApi = () => axios.get("/prestamos");

export const createLoans = (data) => axios.post("/prestamos",data);

export const getLoansById = (id) => axios.get(`/prestamos/${id}`);

export const getLoansByAlumno = (id) => axios.get(`/prestamos/prestamos-alumno/${id}`);

export const getAllRequests = () => axios.get(`/prestamos/get-requests`);

export const requestsVal = data => axios.put(`/prestamos/accept-request`,data);

export const getAllLoansToDeliver = () => axios.get(`/prestamos/get-not-deliveries`);

export const acceptDelivery = (data) => axios.put(`/prestamos/confirm-delivery`,data);

export const getAllLoansToReturn = () => axios.get("/prestamos/get-not-return");

export const confirmReturn = (data) => axios.put(`/prestamos/confirm-return`,data);

export const deleteLoan = (id) => axios.delete(`/prestamos/${id}`);
