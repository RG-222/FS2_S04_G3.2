
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Index() {
    return (
        <Container className="inicio mt-5 mb-5">
            <Row className="align-items-center">
                <Col md={6}>
                    <h1>¡Bienvenidos a Pastelería 1000 Sabores!</h1>

                    <h3>Cumplimos 50 años acompañandote en bellos momentos.</h3>

                    <p>
                        Descubre los sabores de siempre y nuestros nuevos 
                        sabores pensados para acompañarte en tus más valiosos
                         momentos.
                    </p>

                    <Button as={Link} to="/productos" variant="dark">
                        Ver nuestros productos
                    </Button>
                </Col>

                <Col md={6} className="text-center mt-4 mt-md-0">
                    <img
                        src="/src/assets/img/50annios.png"
                        alt="Deliciosos pasteles de la pastelería"
                        className="imagen-inicio"
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Index;
