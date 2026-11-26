import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { request, object } from '../services/api';
const AuthContext = createContext(null);
const key = 'hrn.session';
export const roles = ['cliente', 'administrador', 'empleado', 'cajero'];
export const homeFor = rol => ({ cliente: '/registro', administrador: '/panel', empleado: '/panel', cajero: '/caja' }[rol] || '/');
function claims(token) { try {
    const s = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s), c => c.charCodeAt(0))));
}
catch {
    return {};
} }
function safeUser(user) { return { id: user.id ?? user.id_usuario ?? user.idUsuario ?? user.sub, nombre: user.nombre ?? user.name ?? 'Usuario', correo: user.correo ?? user.email ?? '', rol: user.rol ?? user.role, turno: user.turno ?? null }; }
function restore() { try {
    const s = JSON.parse(sessionStorage.getItem(key));
    if (s?.token && roles.includes(s.user?.rol) && claims(s.token).exp * 1000 > Date.now())
        return { token: s.token, user: safeUser(s.user) };
}
catch { } return null; }
export function AuthProvider({ children }) {
    const [session, setSession] = useState(restore);
    const logout = useCallback(() => { sessionStorage.removeItem(key); for (const k of Object.keys(sessionStorage))
        if (k.startsWith('hrn.history.'))
            sessionStorage.removeItem(k); setSession(null); }, []);
    const login = useCallback(async (correo, contrasena) => { const data = await request('/auth/login', { method: 'POST', body: { correo, contrasena } }); const payload = data?.data ?? data; const token = payload.token ?? payload.accessToken ?? payload.access_token ?? payload.jwt ?? data.token; if (typeof token !== 'string')
        throw new Error('El login no devolvió un JWT reconocido.'); const decoded = claims(token); const user = safeUser({ ...decoded, ...(decoded.usuario ?? decoded.user ?? {}), ...payload, ...(payload.usuario ?? payload.user ?? data.usuario ?? data.user ?? {}) }); if (user.id == null || !roles.includes(user.rol) || !decoded.exp || decoded.exp * 1000 <= Date.now())
        throw new Error('JWT sin rol válido o sin vencimiento vigente. Revisa el contrato del login.'); const s = { token, user }; sessionStorage.setItem(key, JSON.stringify(s)); setSession(s); return user; }, []);
    const api = useCallback(async (path, options = {}) => { try {
        return await request(path, { ...options, token: session?.token });
    }
    catch (e) {
        if (e.status === 401 && session)
            logout();
        throw e;
    } }, [session, logout]);
    useEffect(() => { if (!session)
        return; const ms = claims(session.token).exp * 1000 - Date.now(); const id = setTimeout(logout, Math.min(Math.max(ms, 0), 2147483647)); return () => clearTimeout(id); }, [session, logout]);
    return <AuthContext.Provider value={{ user: session?.user ?? null, login, logout, api }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
