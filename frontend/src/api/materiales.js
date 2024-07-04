import axios from "./axios";

// CRUD DE ADITIVOS //

export const getAllAditivos = () => axios.get("/aditivos");

export const createAditivo = (data) => axios.post("/aditivos",data);

export const getAditivoById = (id) => axios.get(`/aditivos/${id}`);

export const updateAditivo = (id,data) => axios.patch(`/aditivos/${id}`,data);

export const deleteAditivo = (id) => axios.delete(`/aditivos/${id}`);


 // CRUD EQUIPOS LAB //

 export const createEquipoLab = (data) => axios.post("/equipos-lab",data);

 export const getAllEquipoLab = () => axios.get("/equipos-lab");

 export const getEquipoLabById = id => axios.get(`/equipos-lab/${id}`);

 export const updateEquipoLab = (id,data) => axios.patch(`/equipos-lab/${id}`,data);

 export const deleteEquipoLab = (id) => axios.delete(`/equipos-lab/${id}`);

 // CRUD EQUIPOS TALLER //

 export const createEquipoTaller = (data) => axios.post("/equipos-taller",data);

 export const getAllEquipoTaller = () => axios.get("/equipos-taller");

 export const getEquipoTallerById = id => axios.get(`/equipos-taller/${id}`);

 export const updateEquipoTaller= (id,data) => axios.patch(`/equipos-taller/${id}`,data);

 export const deleteEquipoTaller = (id) => axios.delete(`/equipos-taller/${id}`);

  // MATERIAL DE INVENTARIO //

  export const createMaterialInventario = (data) => axios.post("/material-inventario",data);

  export const getAllMaterialInventario = () => axios.get("/material-inventario");
 
  export const getMaterialInventarioById= id => axios.get(`/material-inventario/${id}`);
 
  export const updateMaterialInventario = (id,data) => axios.patch(`/material-inventario/${id}`,data);
 
  export const deleteMaterialInventario = (id) => axios.delete(`/material-inventario/${id}`);


  // MATERIAL DE LABORATORIO //

  export const createMaterialLab = (data) => axios.post("/material-lab",data);

  export const getAllMaterialLab = () => axios.get("/material-lab");
 
  export const getMaterialLabById= id => axios.get(`/material-lab/${id}`);
 
  export const updateMaterialLab = (id,data) => axios.patch(`/material-lab/${id}`,data);
 
  export const deleteMaterialLab = (id) => axios.delete(`/material-lab/${id}`);