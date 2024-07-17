import axios from "./axios";

// CRUD DE ADITIVOS //

export const getAllAditivos = () => axios.get("/aditivos");

export const createAditivo = (data, token) => axios.post("/aditivos", data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const getAditivoById = (id) => axios.get(`/aditivos/${id}`);

export const updateAditivo = (id, data, token) => axios.patch(`/aditivos/${id}`, data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const deleteAditivo = (id, token) => axios.delete(`/aditivos/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});


// CRUD EQUIPOS LAB //

export const createEquipoLab = (data, token) => axios.post("/equipos-lab", data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const getAllEquipoLab = () => axios.get("/equipos-lab");

export const getEquipoLabById = id => axios.get(`/equipos-lab/${id}`);

export const updateEquipoLab = (id, data, token) => axios.patch(`/equipos-lab/${id}`, data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const deleteEquipoLab = (id, token) => axios.delete(`/equipos-lab/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});



// CRUD EQUIPOS TALLER //

export const createEquipoTaller = (data, token) => axios.post("/equipos-taller", data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const getAllEquipoTaller = () => axios.get("/equipos-taller");

export const getEquipoTallerById = id => axios.get(`/equipos-taller/${id}`);

export const updateEquipoTaller = (id, data, token) => axios.patch(`/equipos-taller/${id}`, data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const deleteEquipoTaller = (id, token) => axios.delete(`/equipos-taller/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

// MATERIAL DE INVENTARIO //

export const createMaterialInventario = (data, token) => axios.post("/material-inventario", data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const getAllMaterialInventario = () => axios.get("/material-inventario");

export const getMaterialInventarioById = id => axios.get(`/material-inventario/${id}`);

export const updateMaterialInventario = (id, data, token) => axios.patch(`/material-inventario/${id}`, data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const deleteMaterialInventario = (id, token) => axios.delete(`/material-inventario/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});


// MATERIAL DE LABORATORIO //

export const createMaterialLab = (data,token) => axios.post("/material-lab", data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const getAllMaterialLab = () => axios.get("/material-lab");

export const getMaterialLabById = id => axios.get(`/material-lab/${id}`);

export const updateMaterialLab = (id, data,token) => axios.patch(`/material-lab/${id}`, data, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const deleteMaterialLab = (id,token) => axios.delete(`/material-lab/${id}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});