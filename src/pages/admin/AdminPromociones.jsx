
import { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
    Table,
    Badge,
    Spinner
} from 'react-bootstrap';

import {
    obtenerPromocionesAPI,
    crearPromocionAPI,
    actualizarPromocionAPI,
    eliminarPromocionAPI
} from '../../services/api';

function AdminPromociones() {
    const formularioInicial = {
        codigo: '',
        nombre: '',
        descuento: '',
        descripcion: ''
    };

    const [promociones, setPromociones] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [promocionEditando, setPromocionEditando] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        cargarPromociones();
    }, []);

    async function cargarPromociones() {
        setCargando(true);
        setError('');

        try {
            const datos = await obtenerPromocionesAPI();
            setPromociones(datos);
        } catch (err) {
            setError(err.message || 'No se pudieron cargar las promociones.');
        } finally {
            setCargando(false);
        }
    }

    function manejarCambio(event) {
        const { name, value } = event.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    async function manejarEnvio(event) {
        event.preventDefault();

        setError('');
        setMensaje('');

        const codigo = formulario.codigo.trim().toUpperCase();
        const nombre = formulario.nombre.trim();
        const descuento = Number(formulario.descuento);
        const descripcion = formulario.descripcion.trim();

        if (!codigo || !nombre || !formulario.descuento || !descripcion) {
            setError('Completa todos los campos.');
            return;
        }

        if (!Number.isFinite(descuento) || descuento < 1 || descuento > 100) {
            setError('El descuento debe estar entre 1% y 100%.');
            return;
        }

        const datos = {
            codigo,
            nombre,
            descuento,
            descripcion
        };

        setGuardando(true);

        try {
            if (promocionEditando) {
                await actualizarPromocionAPI(promocionEditando, datos);
                setMensaje('Promoción actualizada correctamente.');
            } else {
                await crearPromocionAPI(datos);
                setMensaje('Promoción creada correctamente.');
            }

            setFormulario(formularioInicial);
            setPromocionEditando(null);

            await cargarPromociones();

        } catch (err) {
            setError(err.message || 'No se pudo guardar la promoción.');
        } finally {
            setGuardando(false);
        }
    }

    function editarPromocion(promocion) {
        setPromocionEditando(promocion.codigo);

        setFormulario({
            codigo: promocion.codigo,
            nombre: promocion.nombre,
            descuento: String(promocion.descuento),
            descripcion: promocion.descripcion
        });

        setError('');
        setMensaje('');
    }

    function cancelarEdicion() {
        setPromocionEditando(null);
        setFormulario(formularioInicial);
        setError('');
        setMensaje('');
    }

    async function manejarEliminar(codigo) {
        const confirmar = window.confirm(
            '¿Estás segura de que deseas eliminar esta promoción?'
        );

        if (!confirmar) return;

        setError('');
        setMensaje('');

        try {
            await eliminarPromocionAPI(codigo);

            setMensaje('Promoción eliminada correctamente.');

            if (promocionEditando === codigo) {
                cancelarEdicion();
            }

            await cargarPromociones();

        } catch (err) {
            setError(err.message || 'No se pudo eliminar la promoción.');
        }
    }

    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-3">
                Administrar promociones
            </h1>

            <p className="text-center mb-4">
                Crea y administra los códigos de descuento de la pastelería.
            </p>

            {error && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError('')}
                >
                    {error}
                </Alert>
            )}

            {mensaje && (
                <Alert
                    variant="success"
                    dismissible
                    onClose={() => setMensaje('')}
                >
                    {mensaje}
                </Alert>
            )}

            <Card className="formulario-pasteleria mb-5">
                <Card.Body>
                    <h2 className="h4 mb-4">
                        {promocionEditando
                            ? 'Editar promoción'
                            : 'Crear promoción'}
                    </h2>

                    <Form onSubmit={manejarEnvio}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código de promoción</Form.Label>

                                    <Form.Control
                                        name="codigo"
                                        value={formulario.codigo}
                                        onChange={manejarCambio}
                                        placeholder="Ej.: FELICES50"
                                        disabled={Boolean(promocionEditando)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>

                                    <Form.Control
                                        name="nombre"
                                        value={formulario.nombre}
                                        onChange={manejarCambio}
                                        placeholder="Nombre de la promoción"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Descuento (%)</Form.Label>

                            <Form.Control
                                type="number"
                                name="descuento"
                                min="1"
                                max="100"
                                value={formulario.descuento}
                                onChange={manejarCambio}
                                placeholder="Ej.: 10"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>

                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="descripcion"
                                value={formulario.descripcion}
                                onChange={manejarCambio}
                                placeholder="Describe las condiciones de la promoción"
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            variant="dark"
                            disabled={guardando}
                        >
                            {guardando
                                ? 'Guardando...'
                                : promocionEditando
                                    ? 'Guardar cambios'
                                    : 'Crear promoción'}
                        </Button>

                        {promocionEditando && (
                            <Button
                                type="button"
                                variant="secondary"
                                className="ms-2"
                                onClick={cancelarEdicion}
                                disabled={guardando}
                            >
                                Cancelar
                            </Button>
                        )}
                    </Form>
                </Card.Body>
            </Card>

            <h2 className="h4 mb-3">Promociones registradas</h2>

            {cargando ? (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                    <p className="mt-2">Cargando promociones...</p>
                </div>
            ) : promociones.length === 0 ? (
                <Alert variant="info">
                    No hay promociones registradas.
                </Alert>
            ) : (
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Descuento</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {promociones.map(promocion => (
                            <tr key={promocion.codigo}>
                                <td>
                                    <strong>{promocion.codigo}</strong>
                                </td>

                                <td>{promocion.nombre}</td>

                                <td>
                                    <Badge bg="success">
                                        {promocion.descuento}%
                                    </Badge>
                                </td>

                                <td>{promocion.descripcion}</td>

                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() => editarPromocion(promocion)}
                                        >
                                            Editar
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => manejarEliminar(promocion.codigo)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default AdminPromociones;
