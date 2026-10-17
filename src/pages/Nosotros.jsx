
import { Container, Row, Col, Card } from 'react-bootstrap';

function Nosotros() {
    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-4">
                Sobre nosotros
            </h1>

            <Row className="align-items-center mb-5">
                <Col md={7}>
                    <h2>50 años de tradición y dulzura</h2>

                    <p>
                        Pastelería 1000 Sabores celebra cinco décadas
                        ofreciendo productos de repostería para compartir
                        momentos especiales con familiares y amigos.
                    </p>

                    <p>
                        Nuestra propuesta busca combinar la tradición de
                        la repostería chilena con una experiencia de compra
                        online sencilla y accesible para nuestros clientes.
                    </p>
                </Col>

                <Col md={5}>
                    <img
                        src="/assets/img/50annios.png"
                        alt="Productos de Pastelería 1000 Sabores"
                        className="imagen-nosotros"
                    />
                </Col>
            </Row>

            <Row>
                <Col md={6} className="mb-3">
                    <Card className="h-100 tarjeta-producto">
                        <Card.Body>
                            <Card.Title>Nuestra misión</Card.Title>
                            <Card.Text>
                                Ofrecer productos de repostería de calidad,
                                brindando una experiencia de compra cómoda
                                y agradable para cada cliente.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-3">
                    <Card className="h-100 tarjeta-producto">
                        <Card.Body>
                            <Card.Title>Nuestra historia</Card.Title>
                            <Card.Text>
                                En 1995, la pastelería participó en la
                                elaboración de la torta más grande del mundo,
                                un hito que forma parte de su historia.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Nosotros;
