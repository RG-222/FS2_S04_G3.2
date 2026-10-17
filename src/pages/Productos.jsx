
import { productosIniciales } from '../data/productos';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form
} from 'react-bootstrap';

function cargarProductos() {
    const productosGuardados = localStorage.getItem('productos');

    if (productosGuardados !== null) {
        try {
            return JSON.parse(productosGuardados);
        } catch {
            localStorage.setItem(
                'productos',
                JSON.stringify(productosIniciales)
            );
        }
    }

    localStorage.setItem(
        'productos',
        JSON.stringify(productosIniciales)
    );

    return productosIniciales;
}

function Productos() {
    const [productos] = useState(cargarProductos);
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('Todas');
    const [orden, setOrden] = useState('predeterminado');

    let productosFiltrados = productos.filter(function (producto) {
        const coincideNombre = producto.nombre
            .toLowerCase()
            .includes(busqueda.trim().toLowerCase());

        const coincideCategoria =
            categoria === 'Todas' ||
            producto.categoria === categoria;

        return coincideNombre && coincideCategoria;
    });

    if (orden === 'menor') {
        productosFiltrados.sort(function (a, b) {
            return a.precio - b.precio;
        });
    } else if (orden === 'mayor') {
        productosFiltrados.sort(function (a, b) {
            return b.precio - a.precio;
        });
    }

    function formatoPrecio(precio) {
        return Number(precio).toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        });
    }

    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-4">
                Nuestros productos
            </h1>

            <p className="text-center mb-4">
                Descubre nuestras delicias preparadas con tradición y dulzura.
            </p>

            <div className="filtros-productos">
                <Form.Group className="campo-filtro">
                    <Form.Label>Buscar producto:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ej. torta de chocolate"
                        value={busqueda}
                        onChange={function (event) {
                            setBusqueda(event.target.value);
                        }}
                    />
                </Form.Group>

                <Form.Group className="campo-filtro">
                    <Form.Label>Categoría:</Form.Label>
                    <Form.Select
                        value={categoria}
                        onChange={function (event) {
                            setCategoria(event.target.value);
                        }}
                    >
                        <option value="Todas">Todas las categorías</option>
                        <option value="Tortas Cuadradas">Tortas Cuadradas</option>
                        <option value="Tortas Circulares">Tortas Circulares</option>
                        <option value="Postres Individuales">Postres Individuales</option>
                        <option value="Productos Sin Azúcar">Productos Sin Azúcar</option>
                        <option value="Pastelería Tradicional">Pastelería Tradicional</option>
                        <option value="Productos Sin Gluten">Productos Sin Gluten</option>
                        <option value="Productos Vegana">Productos Vegana</option>
                        <option value="Tortas Especiales">Tortas Especiales</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="campo-filtro">
                    <Form.Label>Ordenar por precio:</Form.Label>
                    <Form.Select
                        value={orden}
                        onChange={function (event) {
                            setOrden(event.target.value);
                        }}
                    >
                        <option value="predeterminado">
                            Orden predeterminado
                        </option>
                        <option value="menor">Menor a mayor</option>
                        <option value="mayor">Mayor a menor</option>
                    </Form.Select>
                </Form.Group>
            </div>

            <p className="text-center mt-3">
                Productos encontrados: {productosFiltrados.length}
            </p>

            <Row className="g-4 mt-2">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map(function (producto) {
                        return (
                            <Col
                                key={producto.id}
                                xs={12}
                                sm={6}
                                lg={3}
                            >
                                <Card className="tarjeta-producto h-100">
                                    <Card.Img
                                        variant="top"
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        className="imagen-tarjeta-producto"
                                    />

                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title>
                                            {producto.nombre}
                                        </Card.Title>

                                        <Card.Text>
                                            {producto.descripcion}
                                        </Card.Text>

                                        <p className="precio-producto mt-auto">
                                            {formatoPrecio(producto.precio)}
                                        </p>

                                        <Button
                                            as={Link}
                                            to={`/productos/${producto.id}`}
                                            variant="dark"
                                        >
                                            Ver detalles
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })
                ) : (
                    <Col xs={12}>
                        <div className="sin-resultados">
                            No se encontraron productos que coincidan
                            con tu búsqueda.
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default Productos;
