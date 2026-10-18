
import { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';

function Registro() {
    const formularioInicial = { nombre: '', apellido: '', correo: '', telefono: '', fecha: '', contrasena: '', confirmar: '' };
    const [formulario, setFormulario] = useState(formularioInicial);
    const [errores, setErrores] = useState([]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormulario({ ...formulario, [name]: value });
    }

    function validarRegistro() {
        const nuevosErrores = [];
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (formulario.nombre.trim() === '') nuevosErrores.push('El nombre no puede quedar vacío.');
        if (formulario.apellido.trim() === '') nuevosErrores.push('El apellido no puede quedar vacío.');

        if (formulario.correo.trim() === '') {
            nuevosErrores.push('El correo no puede quedar vacío.');
        } else if (!regexCorreo.test(formulario.correo.trim())) {
            nuevosErrores.push('El correo no tiene un formato válido.');
        }

        if (formulario.telefono.trim() === '') nuevosErrores.push('El teléfono no puede quedar vacío.');
        if (formulario.fecha === '') nuevosErrores.push('La fecha de nacimiento es obligatoria.');

        if (formulario.contrasena === '') {
            nuevosErrores.push('La contraseña no puede quedar vacía.');
        } else if (formulario.contrasena.length < 6) {
            nuevosErrores.push('La contraseña debe tener al menos 6 caracteres.');
        }

        if (formulario.confirmar === '') {
            nuevosErrores.push('Debes confirmar tu contraseña.');
        } else if (formulario.contrasena !== formulario.confirmar) {
            nuevosErrores.push('Las contraseñas no coinciden.');
        }

        return nuevosErrores;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const nuevosErrores = validarRegistro();

        if (nuevosErrores.length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        const correo = formulario.correo.trim();
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioExistente = usuarios.find(function (usuario) {
            return usuario.correo === correo;
        });

        if (usuarioExistente) {
            setErrores(['Este correo ya se encuentra registrado.']);
            return;
        }

        const nuevoUsuario = {
            nombre: formulario.nombre.trim(),
            apellido: formulario.apellido.trim(),
            correo: correo,
            telefono: formulario.telefono.trim(),
            fecha: formulario.fecha,
            contrasena: formulario.contrasena
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        setErrores([]);
        setFormulario(formularioInicial);
        alert('¡Registro realizado correctamente!');
    }

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="formulario-pasteleria">
                        <h1 className="titulo-productos text-center mb-3">Crear una cuenta</h1>
                        <p className="text-center mb-4">Regístrate para disfrutar de nuestros productos y promociones.</p>

                        {errores.length > 0 && (
                            <Alert variant="danger" id="errores">
                                <ul className="mb-0">
                                    {errores.map((error, index) => <li key={index}>{error}</li>)}
                                </ul>
                            </Alert>
                        )}

                        <Form id="datos" noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="nombre">Nombre:</Form.Label>
                                <Form.Control id="nombre" type="text" name="nombre" placeholder="Jane" autoComplete="given-name" value={formulario.nombre} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="apellido">Apellido:</Form.Label>
                                <Form.Control id="apellido" type="text" name="apellido" placeholder="Doe" autoComplete="family-name" value={formulario.apellido} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="correo">Correo electrónico:</Form.Label>
                                <Form.Control id="correo" type="email" name="correo" placeholder="Jane.doe@email.com" autoComplete="email" value={formulario.correo} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="telefono">Teléfono:</Form.Label>
                                <Form.Control id="telefono" type="tel" name="telefono" placeholder="+569 12345678" autoComplete="tel" value={formulario.telefono} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="fecha">Fecha de nacimiento:</Form.Label>
                                <Form.Control id="fecha" type="date" name="fecha" value={formulario.fecha} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="contrasena">Contraseña:</Form.Label>
                                <Form.Control id="contrasena" type="password" name="contrasena" autoComplete="new-password" value={formulario.contrasena} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label htmlFor="confirmar">Confirmar contraseña:</Form.Label>
                                <Form.Control id="confirmar" type="password" name="confirmar" autoComplete="new-password" value={formulario.confirmar} onChange={handleChange} />
                            </Form.Group>

                            <Button type="submit" variant="dark" className="w-100">Registrarme</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Registro;
