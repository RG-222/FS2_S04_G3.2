
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

describe('Formulario de inicio de sesión', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it('muestra los campos para iniciar sesión', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(
            screen.getByRole('heading', { name: 'Iniciar sesión' })
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText('correo@ejemplo.cl')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', { name: 'Ingresar' })
        ).toBeInTheDocument();
    });

    it('muestra un error si los campos están vacíos', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

        expect(
            screen.getByText('Debes ingresar tu correo y contraseña.')
        ).toBeInTheDocument();
    });

    it('permite iniciar sesión con credenciales correctas', () => {
        localStorage.setItem(
            'usuarios',
            JSON.stringify([
                {
                    nombre: 'Ana',
                    apellido: 'Pérez',
                    correo: 'ana@example.com',
                    contrasena: 'clave123'
                }
            ])
        );

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.cl'), {
            target: { value: 'ana@example.com' }
        });

        fireEvent.change(screen.getByLabelText('Contraseña:'), {
            target: { value: 'clave123' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

        expect(
            screen.getByText('¡Bienvenido/a, Ana!')
        ).toBeInTheDocument();

        const usuarioActivo = JSON.parse(
            localStorage.getItem('usuarioActivo')
        );

        expect(usuarioActivo.correo).toBe('ana@example.com');
        expect(usuarioActivo.tipo).toBe('cliente');
    });

    it('rechaza credenciales incorrectas', () => {
        localStorage.setItem(
            'usuarios',
            JSON.stringify([
                {
                    nombre: 'Ana',
                    correo: 'ana@example.com',
                    contrasena: 'clave123'
                }
            ])
        );

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.cl'), {
            target: { value: 'ana@example.com' }
        });

        fireEvent.change(screen.getByLabelText('Contraseña:'), {
            target: { value: 'incorrecta' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

        expect(
            screen.getByText('El correo o la contraseña son incorrectos.')
        ).toBeInTheDocument();

        expect(localStorage.getItem('usuarioActivo')).toBeNull();
    });
});
