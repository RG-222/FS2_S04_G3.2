
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AppNavbar from './components/Navbar';
import Footer from './components/Footer';

import Index from './pages/Index';
import Productos from './pages/Productos';
import Nosotros from './pages/Nosotros';
import Registro from './pages/Registro';
import Login from './pages/Login';
import DetalleProducto from './pages/DetalleProducto';

import ProteccionAdmin from './pages/admin/ProteccionAdmin';
import AdminInicio from './pages/admin/AdminInicio';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminProductos from './pages/admin/AdminProductos';
import AdminPromociones from './pages/admin/AdminPromociones';
import AdminUsuarios from './pages/admin/AdminUsuarios';

function App() {
    return (
        <BrowserRouter>
            <AppNavbar />

            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/productos/:id"
                    element={<DetalleProducto />}
                />

                <Route
                    path="/admin"
                    element={
                        <ProteccionAdmin>
                            <AdminInicio />
                        </ProteccionAdmin>
                    }
                />

                <Route
                    path="/admin/pedidos"
                    element={
                        <ProteccionAdmin>
                            <AdminPedidos />
                        </ProteccionAdmin>
                    }
                />

                <Route
                    path="/admin/productos"
                    element={
                        <ProteccionAdmin>
                            <AdminProductos />
                        </ProteccionAdmin>
                    }
                />

                <Route
                    path="/admin/promociones"
                    element={
                        <ProteccionAdmin>
                            <AdminPromociones />
                        </ProteccionAdmin>
                    }
                />

                <Route
                    path="/admin/usuarios"
                    element={
                        <ProteccionAdmin>
                            <AdminUsuarios />
                        </ProteccionAdmin>
                    }
                />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;
