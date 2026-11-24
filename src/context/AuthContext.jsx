import { createContext, useContext, useEffect, useState } from 'react';
import {
    guardarToken,
    iniciarSesionAPI,
    renovarSesionAPI,
    cerrarSesionAPI
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function recuperarSesion() {
            try {
                const respuesta = await renovarSesionAPI();
                guardarToken(respuesta.token);

                setUsuario({
                    nombre: respuesta.nombre,
                    apellido: respuesta.apellido,
                    correo: respuesta.correo,
                    tipo: respuesta.tipo
                });
            } catch {
                guardarToken(null);
                setUsuario(null);
            } finally {
                setCargando(false);
            }
        }

        recuperarSesion();
    }, []);

    async function login(correo, contrasena) {
        const respuesta = await iniciarSesionAPI(correo, contrasena);

        guardarToken(respuesta.token);

        const usuarioAutenticado = {
            nombre: respuesta.nombre,
            apellido: respuesta.apellido,
            correo: respuesta.correo,
            tipo: respuesta.tipo
        };

        setUsuario(usuarioAutenticado);
        return usuarioAutenticado;
    }

    async function logout() {
        await cerrarSesionAPI();
        setUsuario(null);
    }

    return (
        <AuthContext.Provider
            value={{ usuario, cargando, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const contexto = useContext(AuthContext);

    if (!contexto) {
        throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
    }

    return contexto;
}
