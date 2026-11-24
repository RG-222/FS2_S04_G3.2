import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        if (correo.trim() === '' || contrasena === '') {
            setError('Debes ingresar tu correo y contraseña.');
            return;
        }

        try {
            setCargando(true);

            const usuario = await login(correo.trim(), contrasena);

            setCorreo('');
            setContrasena('');

            if (usuario.tipo?.toLowerCase().includes('admin')) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            setError(error.message || 'No se pudo iniciar sesión.');
        } finally {
            setCargando(false);
        }
    }

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="formulario-pasteleria">
                        <h1 className="titulo-productos text-center mb-3">
                            Iniciar sesión
                        </h1>

                        <p className="text-center mb-4">
                            Ingresa a tu cuenta de Pastelería 1000 Sabores.
                        </p>

                        {error && (
                            <Alert variant="danger">{error}</Alert>
                        )}

                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="correo">
                                    Correo electrónico:
                                </Form.Label>

                                <Form.Control
                                    id="correo"
                                    type="email"
                                    name="correo"
                                    placeholder="correo@ejemplo.cl"
                                    autoComplete="email"
                                    value={correo}
                                    onChange={(event) => setCorreo(event.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label htmlFor="contrasena">
                                    Contraseña:
                                </Form.Label>

                                <Form.Control
                                    id="contrasena"
                                    type="password"
                                    name="contrasena"
                                    autoComplete="current-password"
                                    value={contrasena}
                                    onChange={(event) => setContrasena(event.target.value)}
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                variant="dark"
                                className="w-100"
                                disabled={cargando}
                            >
                                {cargando ? 'Ingresando...' : 'Ingresar'}
                            </Button>
                        </Form>

                        <p className="text-center mt-4">
                            ¿Todavía no tienes cuenta?{' '}
                            <Link to="/registro">Regístrate aquí</Link>
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
