import { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { registrarUsuarioAPI } from '../services/api';

function Registro() {
    const formularioInicial = {
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        fecha: '',
        contrasena: '',
        confirmar: ''
    };

    const [formulario, setFormulario] = useState(formularioInicial);
    const [errores, setErrores] = useState([]);
    const [exito, setExito] = useState('');
    const [guardando, setGuardando] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormulario({ ...formulario, [name]: value });
    }

    function validarRegistro() {
        const nuevosErrores = [];
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formulario.nombre.trim()) nuevosErrores.push('El nombre es obligatorio.');
        if (!formulario.apellido.trim()) nuevosErrores.push('El apellido es obligatorio.');

        if (!formulario.correo.trim()) {
            nuevosErrores.push('El correo es obligatorio.');
        } else if (!regexCorreo.test(formulario.correo.trim())) {
            nuevosErrores.push('El correo no tiene un formato válido.');
        }

        if (!formulario.telefono.trim()) nuevosErrores.push('El teléfono es obligatorio.');
        if (!formulario.fecha) nuevosErrores.push('La fecha de nacimiento es obligatoria.');

        if (!formulario.contrasena) {
            nuevosErrores.push('La contraseña es obligatoria.');
        } else if (formulario.contrasena.length < 8) {
            nuevosErrores.push('La contraseña debe tener al menos 8 caracteres.');
        }

        if (!formulario.confirmar) {
            nuevosErrores.push('Debes confirmar tu contraseña.');
        } else if (formulario.contrasena !== formulario.confirmar) {
            nuevosErrores.push('Las contraseñas no coinciden.');
        }

        return nuevosErrores;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setExito('');

        const nuevosErrores = validarRegistro();

        if (nuevosErrores.length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        setErrores([]);
        setGuardando(true);

        try {
            await registrarUsuarioAPI({
                nombre: formulario.nombre.trim(),
                apellido: formulario.apellido.trim(),
                correo: formulario.correo.trim(),
                telefono: formulario.telefono.trim(),
                fechaNacimiento: formulario.fecha,
                contrasena: formulario.contrasena
            });

            setFormulario(formularioInicial);
            setExito('¡Tu cuenta fue creada correctamente! Ya puedes iniciar sesión.');
        } catch (error) {
            setErrores([error.message || 'No se pudo completar el registro.']);
        } finally {
            setGuardando(false);
        }
    }

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="formulario-pasteleria">
                        <h1 className="titulo-productos text-center mb-3">Crear una cuenta</h1>
                        <p className="text-center mb-4">
                            Regístrate para disfrutar de nuestros productos y promociones.
                        </p>

                        {exito && <Alert variant="success">{exito}</Alert>}

                        {errores.length > 0 && (
                            <Alert variant="danger" id="errores">
                                <ul className="mb-0">
                                    {errores.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </Alert>
                        )}

                        <Form id="datos" noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="nombre">Nombre:</Form.Label>
                                <Form.Control id="nombre" type="text" name="nombre"
                                    placeholder="Jane" autoComplete="given-name"
                                    value={formulario.nombre} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="apellido">Apellido:</Form.Label>
                                <Form.Control id="apellido" type="text" name="apellido"
                                    placeholder="Doe" autoComplete="family-name"
                                    value={formulario.apellido} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="correo">Correo electrónico:</Form.Label>
                                <Form.Control id="correo" type="email" name="correo"
                                    placeholder="Jane.doe@email.com" autoComplete="email"
                                    value={formulario.correo} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="telefono">Teléfono:</Form.Label>
                                <Form.Control id="telefono" type="tel" name="telefono"
                                    placeholder="+569 12345678" autoComplete="tel"
                                    value={formulario.telefono} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="fecha">Fecha de nacimiento:</Form.Label>
                                <Form.Control id="fecha" type="date" name="fecha"
                                    value={formulario.fecha} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="contrasena">Contraseña:</Form.Label>
                                <Form.Control id="contrasena" type="password" name="contrasena"
                                    autoComplete="new-password"
                                    value={formulario.contrasena} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label htmlFor="confirmar">Confirmar contraseña:</Form.Label>
                                <Form.Control id="confirmar" type="password" name="confirmar"
                                    autoComplete="new-password"
                                    value={formulario.confirmar} onChange={handleChange} />
                            </Form.Group>

                            <Button type="submit" variant="dark" className="w-100"
                                disabled={guardando}>
                                {guardando ? 'Registrando...' : 'Registrarme'}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Registro;
