import axios from "./axios";

export const crearPractica = (data) => axios.post("/practicas",data);