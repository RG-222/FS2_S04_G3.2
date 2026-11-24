import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { productosIniciales } from '../data/productos';
import { obtenerProductosAPI } from '../services/api';

function DetalleProducto() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function cargarDetalle() {
            try {
                const productos = await obtenerProductosAPI();
                const productoAPI = productos.find(
                    item => String(item.id) === String(id)
                );

                if (productoAPI) {
                    const productoLocal = productosIniciales.find(
                        item => String(item.id) === String(productoAPI.id)
                    );

                    setProducto({
                        ...productoAPI,
                        imagen: productoLocal?.imagen || productoAPI.imagen
                    });
                } else {
                    setProducto(null);
                }
            } catch (error) {
                setError(error.message || 'No se pudo cargar el producto.');
            } finally {
                setCargando(false);
            }
        }

        cargarDetalle();
    }, [id]);

    function formatoPrecio(precio) {
        return Number(precio).toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        });
    }

    if (cargando) {
        return (
            <Container className="mt-5 mb-5 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Cargando producto...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5 mb-5">
                <Alert variant="danger">{error}</Alert>
                <Button as={Link} to="/productos" variant="dark">
                    Volver a productos
                </Button>
            </Container>
        );
    }

    if (!producto) {
        return (
            <Container className="mt-5 mb-5 text-center">
                <h1 className="titulo-productos mb-4">Producto no encontrado</h1>
                <p>El producto puede haber sido eliminado o no estar disponible en este momento.</p>
                <Button as={Link} to="/productos" variant="dark">
                    Volver a productos
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="tarjeta-producto">
                        <Card.Body className="p-4 p-md-5">
                            <img src={producto.imagen} alt={producto.nombre}
                                className="imagen-detalle-producto" />
                            <h1 className="titulo-productos mb-4">{producto.nombre}</h1>
                            <p><strong>Categoría:</strong> {producto.categoria}</p>
                            <p>{producto.descripcion}</p>
                            <p className="precio-producto">{formatoPrecio(producto.precio)}</p>
                            <Button as={Link} to="/productos" variant="dark">
                                Volver al catálogo
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default DetalleProducto;