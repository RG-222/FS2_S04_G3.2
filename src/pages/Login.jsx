import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Login() {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setMensaje('');

        if (correo.trim() === '' || contrasena === '') {
            setError('Debes ingresar tu correo y contraseña.');
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioEncontrado = usuarios.find(function (usuario) {
            return usuario.correo === correo.trim() && usuario.contrasena === contrasena;
        });
        if (!usuarioEncontrado) {
            setError('El correo o la contraseña son incorrectos.');
            return;
        }
        const usuarioActivo = {
            nombre: usuarioEncontrado.nombre,
            apellido: usuarioEncontrado.apellido,
            correo: usuarioEncontrado.correo,
            tipo: usuarioEncontrado.tipo || 'cliente'
        };
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
        setCorreo('');
        setContrasena('');
        if (usuarioActivo.tipo === 'admin') {
            navigate('/admin');
        } else {
            setMensaje('¡Bienvenido/a, ' + usuarioEncontrado.nombre + '!');
            navigate('/');
        }
        }

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="formulario-pasteleria">
                        <h1 className="titulo-productos text-center mb-3">Iniciar sesión</h1>
                        <p className="text-center mb-4">Ingresa a tu cuenta de Pastelería 1000 Sabores.</p>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {mensaje && <Alert variant="success">{mensaje}</Alert>}

                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="correo">Correo electrónico:</Form.Label>
                                <Form.Control id="correo" type="email" name="correo" placeholder="correo@ejemplo.cl" autoComplete="email" value={correo} onChange={(event) => setCorreo(event.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label htmlFor="contrasena">Contraseña:</Form.Label>
                                <Form.Control id="contrasena" type="password" name="contrasena" autoComplete="current-password" value={contrasena} onChange={(event) => setContrasena(event.target.value)} />
                            </Form.Group>

                            <Button type="submit" variant="dark" className="w-100">Ingresar</Button>
                        </Form>

                        <p className="text-center mt-4">
                            ¿Todavía no tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;