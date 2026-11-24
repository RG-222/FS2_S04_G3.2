import { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import {
    obtenerPedidosAPI,
    actualizarPedidoAPI,
    eliminarPedidoAPI,
    obtenerProductosAPI
} from '../../services/api';

const estadosPedido = ['Pendiente', 'En preparación', 'Enviado', 'Entregado'];

function AdminPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);

    async function cargarDatos() {
        try {
            setCargando(true);
            setError('');

            const [pedidosData, productosData] = await Promise.all([
                obtenerPedidosAPI(),
                obtenerProductosAPI()
            ]);

            setPedidos(pedidosData);
            setProductos(productosData);
        } catch (err) {
            setError(err.message || 'No se pudieron cargar los pedidos.');
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cambiarEstado(pedido, nuevoEstado) {
        try {
            setProcesando(true);
            setError('');
            setMensaje('');

            const datos = {
                id: pedido.id,
                cliente: pedido.cliente,
                producto: pedido.producto,
                cantidad: pedido.cantidad,
                total: pedido.total,
                fecha: pedido.fecha,
                estado: nuevoEstado
            };

            const actualizado = await actualizarPedidoAPI(pedido.id, datos);

            setPedidos(lista =>
                lista.map(item =>
                    item.id === pedido.id ? actualizado : item
                )
            );

            setMensaje('Estado del pedido actualizado correctamente.');
        } catch (err) {
            setError(err.message);
        } finally {
            setProcesando(false);
        }
    }

    async function eliminarPedido(id) {
        const confirmar = window.confirm(
            '¿Estás segura de que deseas eliminar este pedido?'
        );

        if (!confirmar) return;

        try {
            setProcesando(true);
            setError('');
            setMensaje('');

            await eliminarPedidoAPI(id);

            setPedidos(lista => lista.filter(pedido => pedido.id !== id));
            setMensaje('Pedido eliminado correctamente.');
        } catch (err) {
            setError(err.message);
        } finally {
            setProcesando(false);
        }
    }

    function formatoPrecio(precio) {
        return Number(precio || 0).toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        });
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

    function nombreProducto(id) {
        const producto = productos.find(item => item.id === id);
        return producto ? producto.nombre : id || 'No registrado';
    }

    return (
        <Container className="mt-5 mb-5">
            <h1 className="titulo-productos text-center mb-3">
                Administrar pedidos
            </h1>

            <p className="text-center mb-4">
                Consulta los pedidos y actualiza su estado de entrega.
            </p>

            {mensaje && (
                <Alert variant="success" dismissible onClose={() => setMensaje('')}>
                    {mensaje}
                </Alert>
            )}

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {cargando ? (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                    <p className="mt-2">Cargando pedidos...</p>
                </div>
            ) : (
                <>
                    <div className="mb-3">
                        <strong>Total de pedidos: </strong>{pedidos.length}
                    </div>

                    {pedidos.length === 0 ? (
                        <Alert variant="info">
                            No hay pedidos registrados en la base de datos.
                        </Alert>
                    ) : (
                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Cliente</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pedidos.map(pedido => (
                                    <tr key={pedido.id}>
                                        <td>{pedido.id}</td>
                                        <td>{pedido.cliente || 'No registrado'}</td>
                                        <td>{nombreProducto(pedido.producto)}</td>
                                        <td>{pedido.cantidad ?? 0}</td>
                                        <td>{formatoPrecio(pedido.total)}</td>
                                        <td>{formatoFecha(pedido.fecha)}</td>
                                        <td>
                                            <Badge bg={varianteEstado(pedido.estado)}>
                                                {pedido.estado || 'Pendiente'}
                                            </Badge>

                                            <Form.Select
                                                className="mt-2"
                                                size="sm"
                                                value={
                                                    estadosPedido.includes(pedido.estado)
                                                        ? pedido.estado
                                                        : 'Pendiente'
                                                }
                                                disabled={procesando}
                                                aria-label={`Estado del pedido ${pedido.id}`}
                                                onChange={event =>
                                                    cambiarEstado(pedido, event.target.value)
                                                }
                                            >
                                                {estadosPedido.map(estado => (
                                                    <option key={estado} value={estado}>
                                                        {estado}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                disabled={procesando}
                                                onClick={() => eliminarPedido(pedido.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </>
            )}
        </Container>
    );
}

export default AdminPedidos;