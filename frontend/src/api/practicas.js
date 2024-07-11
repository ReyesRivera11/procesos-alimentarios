import axios from "./axios";

export const crearPractica = (data) => axios.post("/practicas",data);

export const getPracticas = () => axios.get("/practicas");

export const practicasDisponibles = (data) => axios.get("/practicas/practicas-disponibles",data);
