
import { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';
import {
    obtenerUsuariosAPI,
    eliminarUsuarioAPI
} from '../../services/api';

function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);
    const [eliminando, setEliminando] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    async function cargarUsuarios() {
        try {
            setCargando(true);
            setError('');

            const datos = await obtenerUsuariosAPI();
            setUsuarios(Array.isArray(datos) ? datos : []);
        } catch (err) {
            setError(err.message || 'No se pudieron cargar los usuarios.');
        } finally {
            setCargando(false);
        }
    }

    function calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento) return null;

        const nacimiento = new Date(fechaNacimiento + 'T00:00:00');

        if (Number.isNaN(nacimiento.getTime())) return null;

        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();

        const mesActual = hoy.getMonth();
        const mesNacimiento = nacimiento.getMonth();

        if (
            mesActual < mesNacimiento ||
            (mesActual === mesNacimiento &&
                hoy.getDate() < nacimiento.getDate())
        ) {
            edad--;
        }

        return edad >= 0 ? edad : null;
    }

    function formatoFecha(fecha) {
        if (!fecha) return 'No registrada';

        const fechaValida = new Date(fecha + 'T00:00:00');

        if (Number.isNaN(fechaValida.getTime())) {
            return 'No registrada';
        }

        return fechaValida.toLocaleDateString('es-CL');
    }

    async function eliminarUsuario(usuario) {
        if (usuario.tipo?.toLowerCase() === 'admin') {
            setError('No se puede eliminar una cuenta administradora.');
            return;
        }

        const confirmar = window.confirm(
            `¿Estás segura de que deseas eliminar a ${usuario.correo}?`
        );

        if (!confirmar) return;

        try {
            setEliminando(usuario.id);
            setError('');
            setMensaje('');

            await eliminarUsuarioAPI(usuario.id);

            setUsuarios(actuales =>
                actuales.filter(item => item.id !== usuario.id)
            );

            setMensaje('Usuario eliminado correctamente.');
        } catch (err) {
            setError(err.message || 'No se pudo eliminar el usuario.');
        } finally {
            setEliminando(null);
        }
    }

    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-4">
                Administrar usuarios
            </h1>

            <p className="text-center mb-4">
                Consulta los usuarios registrados y sus beneficios.
            </p>

            {mensaje && (
                <Alert
                    variant="success"
                    dismissible
                    onClose={() => setMensaje('')}
                >
                    {mensaje}
                </Alert>
            )}

            {error && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError('')}
                >
                    {error}
                </Alert>
            )}

            {cargando ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status" />
                    <p className="mt-2">Cargando usuarios...</p>
                </div>
            ) : usuarios.length === 0 ? (
                <Alert variant="info">
                    No hay usuarios registrados.
                </Alert>
            ) : (
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nombre completo</th>
                            <th>Correo</th>
                            <th>Tipo de cuenta</th>
                            <th>Teléfono</th>
                            <th>Fecha de nacimiento</th>
                            <th>Edad</th>
                            <th>Beneficio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map(usuario => {
                            const edad = calcularEdad(
                                usuario.fechaNacimiento
                            );

                            const esAdmin =
                                usuario.tipo?.toLowerCase() === 'admin';

                            return (
                                <tr key={usuario.id}>
                                    <td>
                                        {usuario.nombre || ''}{' '}
                                        {usuario.apellido || ''}
                                    </td>

                                    <td>{usuario.correo}</td>

                                    <td>
                                        {esAdmin ? 'Administrador' : 'Cliente'}
                                    </td>

                                    <td>
                                        {usuario.telefono || 'No registrado'}
                                    </td>

                                    <td>
                                        {formatoFecha(usuario.fechaNacimiento)}
                                    </td>

                                    <td>
                                        {edad !== null
                                            ? `${edad} años`
                                            : 'No registrada'}
                                    </td>

                                    <td>
                                        {edad !== null && edad > 50
                                            ? '50% de descuento'
                                            : 'No corresponde'}
                                    </td>

                                    <td>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            disabled={
                                                esAdmin ||
                                                eliminando === usuario.id
                                            }
                                            title={
                                                esAdmin
                                                    ? 'No se puede eliminar al administrador'
                                                    : 'Eliminar usuario'
                                            }
                                            onClick={() =>
                                                eliminarUsuario(usuario)
                                            }
                                        >
                                            {esAdmin
                                                ? 'Administrador'
                                                : eliminando === usuario.id
                                                    ? 'Eliminando...'
                                                    : 'Eliminar'}
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}

            <p className="text-muted small">
                Usuarios registrados: {usuarios.length}
            </p>
        </Container>
    );
}

export default AdminUsuarios;
