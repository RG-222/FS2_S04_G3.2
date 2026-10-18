
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Productos from '../pages/Productos';

describe('Página de productos', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it('muestra el catálogo de productos', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        );

        expect(
            screen.getByRole('heading', {
                name: 'Nuestros productos'
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText('Torta Cuadrada de Chocolate')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Torta Circular de Vainilla')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Productos encontrados: 16')
        ).toBeInTheDocument();
    });

    it('busca productos por su nombre', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        );

        const campoBusqueda = screen.getByPlaceholderText(
            'Ej. torta de chocolate'
        );

        fireEvent.change(campoBusqueda, {
            target: {
                value: 'chocolate'
            }
        });

        expect(
            screen.getByText('Torta Cuadrada de Chocolate')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Mousse de Chocolate')
        ).toBeInTheDocument();

        expect(
            screen.queryByText('Torta Circular de Vainilla')
        ).not.toBeInTheDocument();

        expect(
            screen.getByText('Productos encontrados: 3')
        ).toBeInTheDocument();
    });

    it('filtra los productos por categoría', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        );

        const filtros = screen.getAllByRole('combobox');
        const filtroCategoria = filtros[0];

        fireEvent.change(filtroCategoria, {
            target: {
                value: 'Tortas Cuadradas'
            }
        });

        expect(
            screen.getByText('Torta Cuadrada de Chocolate')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Torta Cuadrada de Frutas')
        ).toBeInTheDocument();

        expect(
            screen.queryByText('Torta Circular de Vainilla')
        ).not.toBeInTheDocument();

        expect(
            screen.getByText('Productos encontrados: 2')
        ).toBeInTheDocument();
    });

    it('ordena los productos desde el menor precio', () => {
        const { container } = render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        );

        const filtros = screen.getAllByRole('combobox');
        const filtroOrden = filtros[1];

        fireEvent.change(filtroOrden, {
            target: {
                value: 'menor'
            }
        });

        const nombresProductos = Array.from(
            container.querySelectorAll(
                '.tarjeta-producto .card-title'
            )
        ).map(elemento => elemento.textContent);

        expect(nombresProductos[0]).toBe('Empanada de Manzana');
        expect(nombresProductos[1]).toBe('Pan Sin Gluten');
        expect(nombresProductos[2]).toBe('Brownie Sin Gluten');
    });

    it('muestra un mensaje cuando no hay resultados', () => {
        render(
            <MemoryRouter>
                <Productos />
            </MemoryRouter>
        );

        const campoBusqueda = screen.getByPlaceholderText(
            'Ej. torta de chocolate'
        );

        fireEvent.change(campoBusqueda, {
            target: {
                value: 'producto inexistente'
            }
        });

        expect(
            screen.getByText(
                /No se encontraron productos que coincidan/
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText('Productos encontrados: 0')
        ).toBeInTheDocument();
    });
});
