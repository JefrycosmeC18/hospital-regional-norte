const base = (import.meta.env?.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
export class ApiError extends Error {
    constructor(message, status) { super(message); this.status = status; }
}
export async function request(path, { method = 'GET', body, token, signal } = {}) {
    let res;
    try {
        res = await fetch(`${base}/api${path}`, { method, signal, cache: 'no-store', headers: { Accept: 'application/json', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
    }
    catch (e) {
        if (e.name === 'AbortError')
            throw e;
        throw new ApiError('No se pudo conectar con el backend. Revisa VITE_API_URL, CORS y el servidor.', 0);
    }
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    }
    catch {
        data = null;
    }
    if (!res.ok || data?.exito === false || data?.success === false || data?.ok === false) {
        const msg = res.status === 404 ? 'Recurso o endpoint no encontrado. Verifica el contrato de API.' : res.status === 401 ? 'Sesión no válida o credenciales incorrectas.' : res.status === 403 ? 'No tienes permiso para esta operación.' : `Error del servidor (${res.status}).`;
        throw new ApiError(typeof data?.mensaje === 'string' ? data.mensaje : typeof data?.message === 'string' ? data.message : msg, res.status);
    }
    if (res.status !== 204 && data === null)
        throw new ApiError('El backend no devolvió JSON válido.', res.status);
    return data;
}
export function list(data, key) { const value = Array.isArray(data) ? data : data?.[key] ?? data?.datos?.[key] ?? data?.datos ?? data?.data?.[key] ?? data?.data ?? data?.rows; if (!Array.isArray(value))
    throw new Error('Formato de lista no reconocido. Ajusta el adaptador de API.'); return value; }
export function object(data, key) { const v = data?.[key] ?? data?.datos?.[key] ?? data?.datos ?? data?.data?.[key] ?? data?.data ?? data; if (!v || typeof v !== 'object' || Array.isArray(v))
    throw new Error('Respuesta no reconocida del backend.'); return v; }
export function requireFields(value, fields) { if (!fields.every(k => value[k] !== undefined && value[k] !== null))
    throw new Error('El servidor no devolvió los campos requeridos para confirmar la operación.'); return value; }

