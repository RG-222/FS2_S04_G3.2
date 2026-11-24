import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProteccionAdmin({ children }) {
    const { usuario, cargando } = useAuth();

    if (cargando) {
        return (
            <div className="container mt-5 mb-5 text-center">
                Verificando sesión...
            </div>
        );
    }

    const esAdministrador =
        usuario?.tipo?.toLowerCase().includes('admin');

    if (!usuario || !esAdministrador) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProteccionAdmin;
