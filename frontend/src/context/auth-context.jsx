import { createContext, useContext, useState, useEffect } from 'react'
import { login, verifyToken } from '../api/auth';

export const AuthContext = createContext();

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) throw new Error("useAuth debe ser utilizado en el AuthProvider");

    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        verifyAuth();
    }, [])

    const loginAlumno = async (data) => {
        try {
            const res = await login(data);
            if (res) {
                setUser(res.data.user);
                localStorage.setItem("token", res.data.token);
                setAuth(true);
                return res.data.user;
            }
        } catch (error) {
            setAuth(false);
            setError(error.response.data.message);
            setTimeout(() => {
                setError("")
            }, 2000);
        }
    };

    const verifyAuth = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        if (!token) {
            setUser(null);
            setAuth(false);
            setLoading(false);
        }
        try {
            const res = await verifyToken(token);
            if (res) {
                setUser(res.data);
                setAuth(true);
                setLoading(false);
            } else {
                setLoading(false);
                setAuth(false);
                setUser(null);
            }

        } catch (error) {
            setUser(null);
            setAuth(false);
            setLoading(false);

        }
    };


    const signOut = () => {
        localStorage.removeItem("token");
        setUser(null);
        setAuth(false);
    }


    return (
        <AuthContext.Provider
            value={{
                user,
                error,
                loginAlumno,
                auth,
                loading,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}