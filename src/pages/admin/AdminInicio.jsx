import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AdminInicio() {
    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-3">Panel de administración</h1>
            <p className="text-center mb-5">Desde este panel puedes administrar los productos, pedidos, usuarios y promociones de Pastelería 1000 Sabores.</p>

            <Row className="g-4">
                <Col md={6} lg={3}>
                    <Card className="tarjeta-producto h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Productos</Card.Title>
                            <Card.Text>Agrega, modifica o elimina productos del catálogo.</Card.Text>
                            <Button as={Link} to="/admin/productos" variant="dark" className="mt-auto">Administrar productos</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="tarjeta-producto h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Pedidos</Card.Title>
                            <Card.Text>Revisa los pedidos realizados y actualiza su estado.</Card.Text>
                            <Button as={Link} to="/admin/pedidos" variant="dark" className="mt-auto">Administrar pedidos</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="tarjeta-producto h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Usuarios</Card.Title>
                            <Card.Text>Revisa los usuarios registrados en la pastelería.</Card.Text>
                            <Button as={Link} to="/admin/usuarios" variant="dark" className="mt-auto">Administrar usuarios</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="tarjeta-producto h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>Promociones</Card.Title>
                            <Card.Text>Administra las promociones y descuentos disponibles.</Card.Text>
                            <Button as={Link} to="/admin/promociones" variant="dark" className="mt-auto">Administrar promociones</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminInicio;