import { useState } from 'react';
import { Container, Table, Button, Form, Alert, Badge } from 'react-bootstrap';

const estadosPedido = ['Pendiente', 'En preparación', 'Enviado', 'Entregado'];

const pedidosIniciales = [
    { id: 'PED001', cliente: 'Cliente de prueba', producto: 'Torta Cuadrada de Chocolate', cantidad: 1, total: 45000, fecha: '2026-09-10', estado: 'Pendiente' },
    { id: 'PED002', cliente: 'Cliente de prueba 2', producto: 'Torta Circular de Manjar', cantidad: 1, total: 42000, fecha: '2026-09-12', estado: 'En preparación' }
];

function cargarPedidos() {
    const pedidosGuardados = localStorage.getItem('pedidos');
    if (pedidosGuardados !== null) {
        try {
            return JSON.parse(pedidosGuardados);
        } catch {
            localStorage.setItem('pedidos', JSON.stringify(pedidosIniciales));
        }
    }
    localStorage.setItem('pedidos', JSON.stringify(pedidosIniciales));
    return pedidosIniciales;
}

function AdminPedidos() {
    const [pedidos, setPedidos] = useState(cargarPedidos);
    const [mensaje, setMensaje] = useState('');

    function guardarPedidos(listaActualizada) {
        localStorage.setItem('pedidos', JSON.stringify(listaActualizada));
        setPedidos(listaActualizada);
    }

    function cambiarEstado(id, nuevoEstado) {
        const listaActualizada = pedidos.map(pedido => pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido);
        guardarPedidos(listaActualizada);
        setMensaje('Estado del pedido actualizado correctamente.');
    }

    function eliminarPedido(id) {
        const confirmar = window.confirm('¿Estás segura de que deseas eliminar este pedido?');
        if (!confirmar) return;
        const listaActualizada = pedidos.filter(pedido => pedido.id !== id);
        guardarPedidos(listaActualizada);
        setMensaje('Pedido eliminado correctamente.');
    }

    function formatoPrecio(precio) {
        return Number(precio || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
    }

    function formatoFecha(fecha) {
        if (!fecha) return 'No registrada';
        const fechaValida = new Date(`${fecha}T00:00:00`);
        if (Number.isNaN(fechaValida.getTime())) return fecha;
        return fechaValida.toLocaleDateString('es-CL');
    }

    function varianteEstado(estado) {
        switch (estado) {
            case 'Pendiente': return 'warning';
            case 'En preparación': return 'info';
            case 'Enviado': return 'primary';
            case 'Entregado': return 'success';
            default: return 'secondary';
        }
    }

    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-3">Administrar pedidos</h1>
            <p className="text-center mb-4">Consulta los pedidos y actualiza su estado de entrega.</p>

            {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje('')}>{mensaje}</Alert>}

            <div className="mb-3"><strong>Total de pedidos: </strong>{pedidos.length}</div>

            {pedidos.length === 0 ? (
                <Alert variant="info">No hay pedidos registrados.</Alert>
            ) : (
                <Table responsive striped bordered hover>
                    <thead>
                        <tr>
                            <th>Código</th><th>Cliente</th><th>Producto</th><th>Cantidad</th>
                            <th>Total</th><th>Fecha</th><th>Estado</th><th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((pedido, indice) => (
                            <tr key={pedido.id || indice}>
                                <td>{pedido.id || 'Sin código'}</td>
                                <td>{pedido.cliente || 'No registrado'}</td>
                                <td>{pedido.producto || 'No registrado'}</td>
                                <td>{pedido.cantidad ?? 0}</td>
                                <td>{formatoPrecio(pedido.total)}</td>
                                <td>{formatoFecha(pedido.fecha)}</td>
                                <td>
                                    <Badge bg={varianteEstado(pedido.estado)}>{pedido.estado || 'Pendiente'}</Badge>
                                    <Form.Select className="mt-2" size="sm" value={estadosPedido.includes(pedido.estado) ? pedido.estado : 'Pendiente'} aria-label={`Estado del pedido ${pedido.id}`} onChange={event => cambiarEstado(pedido.id, event.target.value)}>
                                        {estadosPedido.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                                    </Form.Select>
                                </td>
                                <td>
                                    <Button size="sm" variant="outline-danger" onClick={() => eliminarPedido(pedido.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default AdminPedidos;