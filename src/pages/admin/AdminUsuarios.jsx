import { useState } from 'react';
import {
    Container,
    Table,
    Button,
    Alert
} from 'react-bootstrap';

function cargarUsuarios() {
    try {
        const usuariosGuardados = JSON.parse(
            localStorage.getItem('usuarios') || '[]'
        );

        return Array.isArray(usuariosGuardados)
            ? usuariosGuardados
            : [];
    } catch {
        return [];
    }
}

function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState(cargarUsuarios);
    const [mensaje, setMensaje] = useState('');

    function calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento) {
            return null;
        }

        const nacimiento = new Date(fechaNacimiento + 'T00:00:00');

        if (Number.isNaN(nacimiento.getTime())) {
            return null;
        }

        const hoy = new Date();

        let edad = hoy.getFullYear() - nacimiento.getFullYear();

        const mesActual = hoy.getMonth();
        const mesNacimiento = nacimiento.getMonth();

        if (
            mesActual < mesNacimiento ||
            (
                mesActual === mesNacimiento &&
                hoy.getDate() < nacimiento.getDate()
            )
        ) {
            edad--;
        }

        return edad >= 0 ? edad : null;
    }

    function eliminarUsuario(correo) {
        const confirmar = window.confirm(
            '¿Estás segura de que deseas eliminar este usuario?'
        );

        if (!confirmar) {
            return;
        }

        const listaActualizada = usuarios.filter(
            usuario => usuario.correo !== correo
        );

        localStorage.setItem(
            'usuarios',
            JSON.stringify(listaActualizada)
        );

        setUsuarios(listaActualizada);
        setMensaje('Usuario eliminado correctamente.');
    }

    function formatoFecha(fecha) {
        if (!fecha) {
            return 'No registrada';
        }

        const fechaValida = new Date(fecha);

        if (Number.isNaN(fechaValida.getTime())) {
            return 'No registrada';
        }

        return fechaValida.toLocaleDateString('es-CL', {
            timeZone: 'UTC'
        });
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

            {usuarios.length === 0 ? (
                <Alert variant="info">
                    No hay usuarios registrados.
                </Alert>
            ) : (
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nombre completo</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Fecha de nacimiento</th>
                            <th>Edad</th>
                            <th>Beneficio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((usuario, indice) => {
                            const edad = calcularEdad(usuario.fecha);
                            const esAdmin = usuario.tipo === 'admin';

                            return (
                                <tr key={usuario.correo || indice}>
                                    <td>
                                        {usuario.nombre || ''}{' '}
                                        {usuario.apellido || ''}
                                    </td>

                                    <td>
                                        {usuario.correo || 'No registrado'}
                                    </td>

                                    <td>
                                        {usuario.telefono || 'No registrado'}
                                    </td>

                                    <td>
                                        {formatoFecha(usuario.fecha)}
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
                                            disabled={esAdmin}
                                            title={
                                                esAdmin
                                                    ? 'No se puede eliminar desde esta pantalla'
                                                    : 'Eliminar usuario'
                                            }
                                            onClick={() =>
                                                eliminarUsuario(
                                                    usuario.correo
                                                )
                                            }
                                        >
                                            {esAdmin
                                                ? 'Administrador'
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