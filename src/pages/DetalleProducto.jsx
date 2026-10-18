
import { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { productosIniciales } from '../data/productos';

function cargarProductos() {
    const productosGuardados = localStorage.getItem('productos');

    if (productosGuardados !== null) {
        try {
            return JSON.parse(productosGuardados);
        } catch {
            localStorage.setItem('productos', JSON.stringify(productosIniciales));
        }
    }

    localStorage.setItem('productos', JSON.stringify(productosIniciales));
    return productosIniciales;
}

function DetalleProducto() {
    const { id } = useParams();
    const [productos] = useState(cargarProductos);
    const producto = productos.find(function (item) {
        return String(item.id) === id;
    });

    function formatoPrecio(precio) {
        return Number(precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
    }

    if (!producto) {
        return (
            <Container className="mt-5 mb-5 text-center">
                <h1 className="titulo-productos mb-4">Producto no encontrado</h1>
                <p>El producto puede haber sido eliminado o no estar disponible en este momento.</p>
                <Button as={Link} to="/productos" variant="dark">Volver a productos</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="tarjeta-producto">
                        <Card.Body className="p-4 p-md-5">
                            <img src={producto.imagen} alt={producto.nombre} className="imagen-detalle-producto" />
                            <h1 className="titulo-productos mb-4">{producto.nombre}</h1>
                            <p><strong>Categoría:</strong> {producto.categoria}</p>
                            <p>{producto.descripcion}</p>
                            <p className="precio-producto">{formatoPrecio(producto.precio)}</p>
                            <Button as={Link} to="/productos" variant="dark">Volver al catálogo</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default DetalleProducto;
