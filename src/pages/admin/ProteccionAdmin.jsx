
import { Navigate } from 'react-router-dom';

function ProteccionAdmin({ children }) {
    const usuarioActivo = JSON.parse(
        localStorage.getItem('usuarioActivo') || 'null'
    );

    if (!usuarioActivo || usuarioActivo.tipo !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProteccionAdmin;
