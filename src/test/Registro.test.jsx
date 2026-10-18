
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Registro from '../pages/Registro';

describe('Formulario de registro', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    it('muestra los campos del formulario', () => {
        render(<Registro />);

        expect(
            screen.getByRole('heading', { name: 'Crear una cuenta' })
        ).toBeInTheDocument();

        expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();
        expect(screen.getByLabelText('Apellido:')).toBeInTheDocument();
        expect(
            screen.getByLabelText(/Correo electrónico:/i)
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Fecha de nacimiento:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Registrarme' }))
            .toBeInTheDocument();
    });

    it('muestra errores cuando se envía el formulario vacío', () => {
        render(<Registro />);

        fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

        expect(screen.getByText('El nombre no puede quedar vacío.'))
            .toBeInTheDocument();
        expect(screen.getByText('El correo no puede quedar vacío.'))
            .toBeInTheDocument();
        expect(screen.getByText('La contraseña no puede quedar vacía.'))
            .toBeInTheDocument();
    });

    it('rechaza un correo con formato inválido', () => {
        render(<Registro />);

        fireEvent.change(screen.getByLabelText('Correo electrónico:'), {
            target: { value: 'correo-invalido' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

        expect(
            screen.getByText('El correo no tiene un formato válido.')
        ).toBeInTheDocument();
    });

    it('rechaza contraseñas de menos de seis caracteres', () => {
        render(<Registro />);

        fireEvent.change(screen.getByLabelText('Contraseña:'), {
            target: { value: '12345' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

        expect(
            screen.getByText(
                'La contraseña debe tener al menos 6 caracteres.'
            )
        ).toBeInTheDocument();
    });

    it('registra un usuario válido en localStorage', () => {
        vi.spyOn(window, 'alert').mockImplementation(() => {});

        render(<Registro />);

        fireEvent.change(screen.getByLabelText('Nombre:'), {
            target: { value: 'Ana' }
        });
        fireEvent.change(screen.getByLabelText('Apellido:'), {
            target: { value: 'Pérez' }
        });
        fireEvent.change(screen.getByLabelText('Correo electrónico:'), {
            target: { value: 'ana@example.com' }
        });
        fireEvent.change(screen.getByLabelText('Teléfono:'), {
            target: { value: '+56912345678' }
        });
        fireEvent.change(screen.getByLabelText('Fecha de nacimiento:'), {
            target: { value: '2000-05-10' }
        });
        fireEvent.change(screen.getByLabelText('Contraseña:'), {
            target: { value: 'clave123' }
        });
        fireEvent.change(screen.getByLabelText('Confirmar contraseña:'), {
            target: { value: 'clave123' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

        const usuarios = JSON.parse(localStorage.getItem('usuarios'));

        expect(usuarios).toHaveLength(1);
        expect(usuarios[0].nombre).toBe('Ana');
        expect(usuarios[0].correo).toBe('ana@example.com');
        expect(window.alert).toHaveBeenCalled();
    });

    it('impide registrar dos veces el mismo correo', () => {
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

        render(<Registro />);

        fireEvent.change(screen.getByLabelText('Nombre:'), {
            target: { value: 'Ana María' }
        });
        fireEvent.change(screen.getByLabelText('Apellido:'), {
            target: { value: 'Pérez' }
        });
        fireEvent.change(screen.getByLabelText('Correo electrónico:'), {
            target: { value: 'ana@example.com' }
        });
        fireEvent.change(screen.getByLabelText('Teléfono:'), {
            target: { value: '+56912345678' }
        });
        fireEvent.change(screen.getByLabelText('Fecha de nacimiento:'), {
            target: { value: '2000-05-10' }
        });
        fireEvent.change(screen.getByLabelText('Contraseña:'), {
            target: { value: 'clave123' }
        });
        fireEvent.change(screen.getByLabelText('Confirmar contraseña:'), {
            target: { value: 'clave123' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));

        expect(
            screen.getByText('Este correo ya se encuentra registrado.')
        ).toBeInTheDocument();

        expect(JSON.parse(localStorage.getItem('usuarios'))).toHaveLength(1);
    });
});
