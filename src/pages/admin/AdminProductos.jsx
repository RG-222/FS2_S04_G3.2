
import { productosIniciales } from '../../data/productos';
import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Table } from 'react-bootstrap';

const categorias = [
    'Tortas Cuadradas', 'Tortas Circulares', 'Postres Individuales', 'Productos Sin Azúcar',
    'Pastelería Tradicional', 'Productos Sin Gluten', 'Productos Vegana', 'Tortas Especiales'
];

function cargarProductos() {
    const productosGuardados = localStorage.getItem('productos');

    if (productosGuardados !== null) {
        try {
            const productos = JSON.parse(productosGuardados);
            // Actualiza las imágenes de los productos iniciales sin sobrescribir el resto de sus datos.
            const productosActualizados = productos.map(producto => {
                const productoInicial = productosIniciales.find(inicial => inicial.id === producto.id);
                if (!productoInicial) return producto;
                return { ...producto, imagen: productoInicial.imagen };
            });

            localStorage.setItem('productos', JSON.stringify(productosActualizados));
            return productosActualizados;
        } catch {
            // Si los datos guardados están dañados, se recupera la lista inicial.
        }
    }

    localStorage.setItem('productos', JSON.stringify(productosIniciales));
    return productosIniciales;
}

function AdminProductos() {
    const [productos, setProductos] = useState(cargarProductos);
    const [editando, setEditando] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const formularioInicial = { id: '', categoria: '', nombre: '', descripcion: '', precio: '', imagen: '' };
    const [formulario, setFormulario] = useState(formularioInicial);

    function guardarProductos(lista) {
        localStorage.setItem('productos', JSON.stringify(lista));
        setProductos(lista);
    }

    function manejarCambio(event) {
        const { name, value } = event.target;
        setFormulario({ ...formulario, [name]: value });
    }

    function manejarEnvio(event) {
        event.preventDefault();
        setError('');
        setMensaje('');

        const { id, categoria, nombre, descripcion, precio, imagen } = formulario;

        if (!id.trim() || !categoria || !nombre.trim() || !descripcion.trim() || !precio) {
            setError('Completa todos los campos obligatorios.');
            return;
        }

        if (Number(precio) <= 0 || !Number.isFinite(Number(precio))) {
            setError('El precio debe ser un número mayor que cero.');
            return;
        }

        const codigo = id.trim();
        const codigoExiste = productos.some(
            producto => String(producto.id).toLowerCase() === codigo.toLowerCase() && producto.id !== editando
        );

        if (codigoExiste) {
            setError('Ya existe un producto con ese código.');
            return;
        }

        const productoNuevo = { id: codigo, categoria, nombre: nombre.trim(), descripcion: descripcion.trim(), precio: Number(precio), imagen: imagen.trim() };
        let listaActualizada;

        if (editando !== null) {
            listaActualizada = productos.map(producto => producto.id === editando ? productoNuevo : producto);
            setMensaje('Producto actualizado correctamente.');
        } else {
            listaActualizada = [...productos, productoNuevo];
            setMensaje('Producto agregado correctamente.');
        }

        guardarProductos(listaActualizada);
        setFormulario(formularioInicial);
        setEditando(null);
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

    function eliminarProducto(id) {
        const confirmar = window.confirm('¿Estás segura de que deseas eliminar este producto?');
        if (!confirmar) return;

        const listaActualizada = productos.filter(producto => producto.id !== id);
        guardarProductos(listaActualizada);

        if (editando === id) cancelarEdicion();

        setError('');
        setMensaje('Producto eliminado correctamente.');
    }

    function cancelarEdicion() {
        setFormulario(formularioInicial);
        setEditando(null);
        setError('');
        setMensaje('');
    }

    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-4">Administrar productos</h1>

            <Card className="formulario-pasteleria mb-5">
                <Card.Body>
                    <h2 className="h4 mb-4">{editando !== null ? 'Editar producto' : 'Agregar producto'}</h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {mensaje && <Alert variant="success">{mensaje}</Alert>}

                    <Form onSubmit={manejarEnvio}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código del producto *</Form.Label>
                                    <Form.Control name="id" value={formulario.id} onChange={manejarCambio} disabled={editando !== null} placeholder="Ej.: TC001" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría *</Form.Label>
                                    <Form.Select name="categoria" value={formulario.categoria} onChange={manejarCambio}>
                                        <option value="">Selecciona una categoría</option>
                                        {categorias.map(categoria => <option key={categoria} value={categoria}>{categoria}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Nombre *</Form.Label>
                            <Form.Control name="nombre" value={formulario.nombre} onChange={manejarCambio} placeholder="Nombre del producto" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción *</Form.Label>
                            <Form.Control as="textarea" rows={3} name="descripcion" value={formulario.descripcion} onChange={manejarCambio} placeholder="Describe el producto" />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio en pesos chilenos *</Form.Label>
                                    <Form.Control type="number" min="1" name="precio" value={formulario.precio} onChange={manejarCambio} placeholder="Ej.: 45000" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ruta o URL de la imagen</Form.Label>
                                    <Form.Control name="imagen" value={formulario.imagen} onChange={manejarCambio} placeholder="Ej.: /imagenes/torta.jpg" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <p className="text-muted small">Los campos marcados con * son obligatorios. Para la imagen puedes ingresar una URL o una ruta pública que tu aplicación pueda cargar.</p>

                        <div className="d-flex gap-2 flex-wrap">
                            <Button type="submit" variant="dark">{editando !== null ? 'Guardar cambios' : 'Agregar producto'}</Button>
                            {editando !== null && <Button type="button" variant="secondary" onClick={cancelarEdicion}>Cancelar edición</Button>}
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <h2 className="h4 mb-3">Productos registrados</h2>

            {productos.length === 0 ? (
                <Alert variant="info">No hay productos guardados todavía.</Alert>
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
                                <td>{Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button size="sm" variant="outline-dark" onClick={() => editarProducto(producto)}>Editar</Button>
                                        <Button size="sm" variant="outline-danger" onClick={() => eliminarProducto(producto.id)}>Eliminar</Button>
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
