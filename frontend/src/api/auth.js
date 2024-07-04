import axios from "./axios";

export const login = data => axios.post("/auth/login", data);

export const verifyToken = (token) => axios.get("/auth/verifyToken", {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

export const changePassword = (id, token, password) => axios.patch(`/alumnos/changePassword/${id}`, password, {
    headers: {
        "Authorization": `Bearer ${token}`,
    },
});