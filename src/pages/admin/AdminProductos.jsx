
import { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    Alert,
    Table,
    Spinner
} from 'react-bootstrap';

import {
    obtenerProductosAPI,
    crearProductoAPI,
    actualizarProductoAPI,
    eliminarProductoAPI
} from '../../services/api';

const categorias = [
    'Tortas Cuadradas',
    'Tortas Circulares',
    'Postres Individuales',
    'Productos Sin Azúcar',
    'Pastelería Tradicional',
    'Productos Sin Gluten',
    'Productos Vegana',
    'Tortas Especiales'
];

const formularioInicial = {
    id: '',
    categoria: '',
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: ''
};

function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [editando, setEditando] = useState(null);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        cargarProductos();
    }, []);

    async function cargarProductos() {
        try {
            setCargando(true);
            setError('');

            const datos = await obtenerProductosAPI();
            setProductos(datos);
        } catch (err) {
            setError(err.message || 'No se pudieron cargar los productos.');
        } finally {
            setCargando(false);
        }
    }

    function manejarCambio(event) {
        const { name, value } = event.target;

        setFormulario(actual => ({
            ...actual,
            [name]: value
        }));
    }

    async function manejarEnvio(event) {
        event.preventDefault();

        setError('');
        setMensaje('');

        const { id, categoria, nombre, descripcion, precio, imagen } = formulario;

        if (
            !id.trim() ||
            !categoria ||
            !nombre.trim() ||
            !descripcion.trim() ||
            !precio
        ) {
            setError('Completa todos los campos obligatorios.');
            return;
        }

        if (!Number.isFinite(Number(precio)) || Number(precio) <= 0) {
            setError('El precio debe ser un número mayor que cero.');
            return;
        }

        const datos = {
            id: id.trim(),
            categoria,
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio: Number(precio),
            imagen: imagen.trim()
        };

        try {
            setGuardando(true);

            if (editando !== null) {
                await actualizarProductoAPI(editando, datos);
                setMensaje('Producto actualizado correctamente.');
            } else {
                await crearProductoAPI(datos);
                setMensaje('Producto agregado correctamente.');
            }

            setFormulario(formularioInicial);
            setEditando(null);

            await cargarProductos();
        } catch (err) {
            setError(err.message || 'No se pudo guardar el producto.');
        } finally {
            setGuardando(false);
        }
    }

    function editarProducto(producto) {
        setFormulario({
            id: String(producto.id),
            categoria: producto.categoria || '',
            nombre: producto.nombre || '',
            descripcion: producto.descripcion || '',
            precio: String(producto.precio ?? ''),
            imagen: producto.imagen || ''
        });

        setEditando(producto.id);
        setError('');
        setMensaje('');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function eliminarProducto(id) {
        const confirmar = window.confirm(
            '¿Estás segura de que deseas eliminar este producto?'
        );

        if (!confirmar) return;

        setError('');
        setMensaje('');

        try {
            await eliminarProductoAPI(id);

            if (editando === id) {
                cancelarEdicion();
            }

            setMensaje('Producto eliminado correctamente.');
            await cargarProductos();
        } catch (err) {
            setError(err.message || 'No se pudo eliminar el producto.');
        }
    }

    function cancelarEdicion() {
        setFormulario(formularioInicial);
        setEditando(null);
        setError('');
        setMensaje('');
    }

    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-4">
                Administrar productos
            </h1>

            <Card className="formulario-pasteleria mb-5">
                <Card.Body>
                    <h2 className="h4 mb-4">
                        {editando !== null ? 'Editar producto' : 'Agregar producto'}
                    </h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {mensaje && <Alert variant="success">{mensaje}</Alert>}

                    <Form onSubmit={manejarEnvio}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código del producto *</Form.Label>
                                    <Form.Control
                                        name="id"
                                        value={formulario.id}
                                        onChange={manejarCambio}
                                        disabled={editando !== null || guardando}
                                        placeholder="Ej.: TC001"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría *</Form.Label>
                                    <Form.Select
                                        name="categoria"
                                        value={formulario.categoria}
                                        onChange={manejarCambio}
                                        disabled={guardando}
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categorias.map(categoria => (
                                            <option key={categoria} value={categoria}>
                                                {categoria}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Nombre *</Form.Label>
                            <Form.Control
                                name="nombre"
                                value={formulario.nombre}
                                onChange={manejarCambio}
                                placeholder="Nombre del producto"
                                disabled={guardando}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="descripcion"
                                value={formulario.descripcion}
                                onChange={manejarCambio}
                                placeholder="Describe el producto"
                                disabled={guardando}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio en pesos chilenos *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        name="precio"
                                        value={formulario.precio}
                                        onChange={manejarCambio}
                                        placeholder="Ej.: 45000"
                                        disabled={guardando}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ruta o URL de la imagen</Form.Label>
                                    <Form.Control
                                        name="imagen"
                                        value={formulario.imagen}
                                        onChange={manejarCambio}
                                        placeholder="Ej.: /imagenes/torta.jpg"
                                        disabled={guardando}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <p className="text-muted small">
                            Los campos marcados con * son obligatorios.
                            Para la imagen puedes ingresar una URL o una ruta pública.
                        </p>

                        <div className="d-flex gap-2 flex-wrap">
                            <Button
                                type="submit"
                                variant="dark"
                                disabled={guardando}
                            >
                                {guardando
                                    ? 'Guardando...'
                                    : editando !== null
                                        ? 'Guardar cambios'
                                        : 'Agregar producto'}
                            </Button>

                            {editando !== null && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={cancelarEdicion}
                                    disabled={guardando}
                                >
                                    Cancelar edición
                                </Button>
                            )}
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <h2 className="h4 mb-3">Productos registrados</h2>

            {cargando ? (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                    <p className="mt-2">Cargando productos...</p>
                </div>
            ) : productos.length === 0 ? (
                <Alert variant="info">No hay productos registrados.</Alert>
            ) : (
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productos.map(producto => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.categoria}</td>
                                <td>
                                    {Number(producto.precio).toLocaleString('es-CL', {
                                        style: 'currency',
                                        currency: 'CLP',
                                        maximumFractionDigits: 0
                                    })}
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline-dark"
                                            onClick={() => editarProducto(producto)}
                                        >
                                            Editar
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => eliminarProducto(producto.id)}
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

export default AdminProductos;
