
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="footer-pasteleria">
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start">
                        <h5>Pastelería 1000 Sabores</h5>
                        <p className="mb-0">
                            Celebrando 50 años de tradición y dulzura.
                        </p>
                    </Col>

                    <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
                        <p className="mb-1">
                            Contacto:
                            {' '}
                            <a href="mailto:contacto@milsabores.cl">
                                contacto@milsabores.cl
                            </a>
                        </p>

                        <p className="mb-0">
                             2026 Pastelería 1000 Sabores.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
