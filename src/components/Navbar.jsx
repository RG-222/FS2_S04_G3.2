
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import logo from '../assets/img/logo.png';

function AppNavbar() {
    return (
        <Navbar className="navbar-pasteleria" expand="lg">
            <Container>
                <Navbar.Brand
                    as={NavLink}
                    to="/"
                    className="marca-pasteleria"
                >
                    <img
                        src={logo}
                        alt="Logo de Pastelería 1000 Sabores"
                        className="logo-pasteleria"
                    />
                    <span>Pasteleria Mil Sabores</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="menu-principal" />

                <Navbar.Collapse id="menu-principal">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/">
                            Inicio |
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/productos">
                            Productos |
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/nosotros">
                            Nosotros |
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/registro">
                            Registro |
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/login">
                            Iniciar sesión |
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
