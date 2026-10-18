
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';

const promocionesIniciales = [
    { codigo: 'FELICES50', nombre: 'Promoción Felices 50', descuento: 10, descripcion: '10% de descuento de por vida para clientes que utilicen el código FELICES50.' }
];

function cargarPromociones() {
    const promocionesGuardadas = localStorage.getItem('promociones');

    if (promocionesGuardadas !== null) {
        try {
            return JSON.parse(promocionesGuardadas);
        } catch {
            localStorage.setItem('promociones', JSON.stringify(promocionesIniciales));
        }
    }

    localStorage.setItem('promociones', JSON.stringify(promocionesIniciales));
    return promocionesIniciales;
}

function AdminPromociones() {
    const [promociones, setPromociones] = useState(cargarPromociones);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const formularioInicial = { codigo: '', nombre: '', descuento: '', descripcion: '' };
    const [formulario, setFormulario] = useState(formularioInicial);

    function guardarPromociones(lista) {
        localStorage.setItem('promociones', JSON.stringify(lista));
        setPromociones(lista);
    }

    function manejarCambio(event) {
        const { name, value } = event.target;
        setFormulario({ ...formulario, [name]: value });
    }

    function manejarEnvio(event) {
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

        const codigoExiste = promociones.some(promocion => promocion.codigo.toUpperCase() === codigo);

        if (codigoExiste) {
            setError('Ya existe una promoción con ese código.');
            return;
        }

        const nuevaPromocion = { codigo, nombre, descuento, descripcion };
        guardarPromociones([...promociones, nuevaPromocion]);
        setFormulario(formularioInicial);
        setMensaje('Promoción creada correctamente.');
    }

    function eliminarPromocion(codigo) {
        const confirmar = window.confirm('¿Estás segura de que deseas eliminar esta promoción?');
        if (!confirmar) return;

        const listaActualizada = promociones.filter(promocion => promocion.codigo !== codigo);
        guardarPromociones(listaActualizada);
        setMensaje('Promoción eliminada correctamente.');
        setError('');
    }

    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-3">Administrar promociones</h1>
            <p className="text-center mb-4">Crea y administra los códigos de descuento de la pastelería.</p>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje('')}>{mensaje}</Alert>}

            <Card className="formulario-pasteleria mb-5">
                <Card.Body>
                    <h2 className="h4 mb-4">Crear promoción</h2>
                    <Form onSubmit={manejarEnvio}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código de promoción</Form.Label>
                                    <Form.Control name="codigo" value={formulario.codigo} onChange={manejarCambio} placeholder="Ej.: FELICES50" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control name="nombre" value={formulario.nombre} onChange={manejarCambio} placeholder="Nombre de la promoción" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Descuento (%)</Form.Label>
                            <Form.Control type="number" name="descuento" min="1" max="100" value={formulario.descuento} onChange={manejarCambio} placeholder="Ej.: 10" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} name="descripcion" value={formulario.descripcion} onChange={manejarCambio} placeholder="Describe las condiciones de la promoción" />
                        </Form.Group>

                        <Button type="submit" variant="dark">Crear promoción</Button>
                    </Form>
                </Card.Body>
            </Card>

            <h2 className="h4 mb-3">Promociones registradas</h2>

            {promociones.length === 0 ? (
                <Alert variant="info">No hay promociones registradas.</Alert>
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
                                <td><strong>{promocion.codigo}</strong></td>
                                <td>{promocion.nombre}</td>
                                <td><Badge bg="success">{promocion.descuento}%</Badge></td>
                                <td>{promocion.descripcion}</td>
                                <td>
                                    <Button size="sm" variant="outline-danger" onClick={() => eliminarPromocion(promocion.codigo)}>Eliminar</Button>
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
