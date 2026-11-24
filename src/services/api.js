
const API_URL = 'http://localhost:8080';

let tokenAcceso = null;

export function guardarToken(token) {
    tokenAcceso = token;
}

export function obtenerToken() {
    return tokenAcceso;
}

// Recuperar sesión cuando el token no está disponible.
async function recuperarToken() {
    if (tokenAcceso) return true;

    try {
        const respuesta = await fetch(`${API_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
        });

        if (!respuesta.ok) return false;

        const sesion = await respuesta.json();

        if (!sesion.token) return false;

        guardarToken(sesion.token);
        return true;

    } catch (error) {
        console.error('Error al recuperar la sesión:', error);
        return false;
    }
}

export async function apiFetch(ruta, opciones = {}) {
    if (!tokenAcceso) {
        await recuperarToken();
    }

    const encabezados = {
        ...(opciones.headers || {})
    };

    if (tokenAcceso) {
        encabezados.Authorization = `Bearer ${tokenAcceso}`;
    }

    if (opciones.body && !encabezados['Content-Type']) {
        encabezados['Content-Type'] = 'application/json';
    }

    return fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: encabezados,
        credentials: 'include'
    });
}

// AUTENTICACIÓN

export async function iniciarSesionAPI(correo, contrasena) {
    const respuesta = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ correo, contrasena })
    });

    if (!respuesta.ok) {
        throw new Error(
            respuesta.status === 401
                ? 'El correo o la contraseña son incorrectos.'
                : 'No se pudo iniciar sesión. Inténtalo nuevamente.'
        );
    }

    return respuesta.json();
}

export async function renovarSesionAPI() {
    const respuesta = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
    });

    if (!respuesta.ok) {
        throw new Error('No hay una sesión activa.');
    }

    return respuesta.json();
}

export async function cerrarSesionAPI() {
    try {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } finally {
        tokenAcceso = null;
    }
}

// USUARIOS

export async function registrarUsuarioAPI(datos) {
    const respuesta = await fetch(`${API_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        if (respuesta.status === 409) {
            throw new Error('Este correo ya se encuentra registrado.');
        }

        if (respuesta.status === 400) {
            throw new Error(
                'Revisa los datos ingresados. La contraseña debe tener al menos 8 caracteres.'
            );
        }

        throw new Error('No se pudo completar el registro.');
    }

    return respuesta.json();
}

export async function obtenerUsuariosAPI() {
    const respuesta = await apiFetch('/api/usuarios');

    if (!respuesta.ok) {
        throw new Error('No se pudieron cargar los usuarios.');
    }

    return respuesta.json();
}

export async function eliminarUsuarioAPI(id) {
    const respuesta = await apiFetch(`/api/usuarios/${id}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo eliminar el usuario.');
    }
}

// PRODUCTOS

export async function obtenerProductosAPI() {
    const respuesta = await apiFetch('/api/productos');

    if (!respuesta.ok) {
        throw new Error('No se pudieron cargar los productos.');
    }

    return respuesta.json();
}

export async function crearProductoAPI(datos) {
    const respuesta = await apiFetch('/api/productos', {
        method: 'POST',
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        const mensaje = await respuesta.text();

        if (respuesta.status === 409) {
            throw new Error('Ya existe un producto con ese código.');
        }

        if (respuesta.status === 403) {
            throw new Error(
                'Acceso denegado. La sesión no tiene permisos de administrador.'
            );
        }

        throw new Error(
            `No se pudo agregar el producto. Error ${respuesta.status}: ${mensaje}`
        );
    }

    return respuesta.json();
}

export async function actualizarProductoAPI(id, datos) {
    const respuesta = await apiFetch(
        `/api/productos/${encodeURIComponent(id)}`,
        {
            method: 'PUT',
            body: JSON.stringify(datos)
        }
    );

    if (!respuesta.ok) {
        throw new Error('No se pudo actualizar el producto.');
    }

    return respuesta.json();
}

export async function eliminarProductoAPI(id) {
    const respuesta = await apiFetch(
        `/api/productos/${encodeURIComponent(id)}`,
        {
            method: 'DELETE'
        }
    );

    if (!respuesta.ok) {
        throw new Error('No se pudo eliminar el producto.');
    }
}

// PEDIDOS

export async function obtenerPedidosAPI() {
    const respuesta = await apiFetch('/api/pedidos');

    if (!respuesta.ok) {
        throw new Error('No se pudieron cargar los pedidos.');
    }

    return respuesta.json();
}

export async function actualizarPedidoAPI(id, datos) {
    const respuesta = await apiFetch(`/api/pedidos/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        const mensaje = await respuesta.text();
        throw new Error(`No se pudo actualizar el pedido: ${mensaje}`);
    }

    return respuesta.json();
}

export async function eliminarPedidoAPI(id) {
    const respuesta = await apiFetch(`/api/pedidos/${encodeURIComponent(id)}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo eliminar el pedido.');
    }
}


// PROMOCIONES

export async function obtenerPromocionesAPI() {
    const respuesta = await apiFetch('/api/promociones');

    if (!respuesta.ok) {
        throw new Error('No se pudieron cargar las promociones.');
    }

    return respuesta.json();
}

export async function crearPromocionAPI(datos) {
    const respuesta = await apiFetch('/api/promociones', {
        method: 'POST',
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        if (respuesta.status === 409) {
            throw new Error('Ya existe una promocion con ese codigo.');
        }

        throw new Error('No se pudo crear la promocion.');
    }

    return respuesta.json();
}

export async function actualizarPromocionAPI(codigo, datos) {
    const respuesta = await apiFetch(
        `/api/promociones/${encodeURIComponent(codigo)}`,
        {
            method: 'PUT',
            body: JSON.stringify(datos)
        }
    );

    if (!respuesta.ok) {
        throw new Error('No se pudo actualizar la promocion.');
    }

    return respuesta.json();
}

export async function eliminarPromocionAPI(codigo) {
    const respuesta = await apiFetch(
        `/api/promociones/${encodeURIComponent(codigo)}`,
        {
            method: 'DELETE'
        }
    );

    if (!respuesta.ok) {
        throw new Error('No se pudo eliminar la promocion.');
    }
}
