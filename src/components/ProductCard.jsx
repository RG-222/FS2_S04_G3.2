
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ProductCard({ producto }) {
    function formatoPrecio(precio) {
        return Number(precio).toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        });
    }

    return (
        <Card className="tarjeta-producto h-100">
            <Card.Img
                variant="top"
                src={producto.imagen}
                alt={producto.nombre}
                className="imagen-tarjeta-producto"
            />

            <Card.Body className="d-flex flex-column">
                <Card.Title>{producto.nombre}</Card.Title>

                <Card.Text>{producto.descripcion}</Card.Text>

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
    );
}

export default ProductCard;
