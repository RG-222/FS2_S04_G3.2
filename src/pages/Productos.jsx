import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import { productosIniciales } from '../data/productos';
import { obtenerProductosAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

function Productos() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('Todas');
    const [orden, setOrden] = useState('predeterminado');

    useEffect(() => {
        async function cargarProductos() {
            try {
                const datos = await obtenerProductosAPI();

                const productosConImagen = datos.map(producto => {
                    const productoLocal = productosIniciales.find(
                        item => String(item.id) === String(producto.id)
                    );

                    return {
                        ...producto,
                        imagen: productoLocal?.imagen || producto.imagen
                    };
                });

                setProductos(productosConImagen);
            } catch (error) {
                setError(error.message || 'No se pudieron cargar los productos.');
            } finally {
                setCargando(false);
            }
        }

        cargarProductos();
    }, []);

    const productosFiltrados = productos
        .filter(producto => {
            const coincideNombre = producto.nombre.toLowerCase()
                .includes(busqueda.trim().toLowerCase());
            const coincideCategoria = categoria === 'Todas' ||
                producto.categoria === categoria;

            return coincideNombre && coincideCategoria;
        })
        .sort((a, b) => {
            if (orden === 'menor') return Number(a.precio) - Number(b.precio);
            if (orden === 'mayor') return Number(b.precio) - Number(a.precio);
            return 0;
        });

    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-4">Nuestros productos</h1>
            <p className="text-center mb-4">
                Descubre nuestras delicias preparadas con tradición y dulzura.
            </p>

            {cargando && (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                    <p className="mt-2">Cargando productos...</p>
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!cargando && !error && (
                <>
                    <div className="filtros-productos">
                        <Form.Group className="campo-filtro">
                            <Form.Label>Buscar producto:</Form.Label>
                            <Form.Control type="text"
                                placeholder="Ej. torta de chocolate"
                                value={busqueda}
                                onChange={event => setBusqueda(event.target.value)} />
                        </Form.Group>

                        <Form.Group className="campo-filtro">
                            <Form.Label>Categoría:</Form.Label>
                            <Form.Select value={categoria}
                                onChange={event => setCategoria(event.target.value)}>
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
                            <Form.Select value={orden}
                                onChange={event => setOrden(event.target.value)}>
                                <option value="predeterminado">Orden predeterminado</option>
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
                            productosFiltrados.map(producto => (
                                <Col key={producto.id} xs={12} sm={6} lg={3}>
                                    <ProductCard producto={producto} />
                                </Col>
                            ))
                        ) : (
                            <Col xs={12}>
                                <div className="sin-resultados">
                                    No se encontraron productos que coincidan con tu búsqueda.
                                </div>
                            </Col>
                        )}
                    </Row>
                </>
            )}
        </Container>
    );
}

export default Productos;
