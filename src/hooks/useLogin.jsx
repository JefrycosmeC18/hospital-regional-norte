import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { homeFor } from '../context/AuthContext';
import { request, object, requireFields } from '../services/api';
import { useAction } from './useResource';
import { useBase, hidden, onSubmit, useFields } from './modelUtils';
export function useLogin() {
    const m = useBase(), a = useAction(), loc = useLocation(), nav = useNavigate();
    const tab = loc.hash === '#registrar' ? 'registrar' : 'iniciar';
    const f = useFields({}), [loader, setLoader] = useState(''), [ok, setOk] = useState(false);
    const delay = ms => new Promise(r => setTimeout(r, ms));
    async function submit(register) { await a.run(async () => { setLoader(register ? 'Creando tu cuenta…' : 'Verificando datos…'); setOk(false); try {
        if (register) {
            const data = await request('/auth/register', { method: 'POST', body: { nombre: f.values.regNombre, correo: f.values.regCorreo, contrasena: f.values.regPass } });
            requireFields(object(data, 'usuario'), ['id']);
            setOk(true);
            setLoader('¡Cuenta creada!');
            await delay(650);
            f.setValues({});
            nav('/login#iniciar');
        }
        else {
            const user = await m.login(f.values.loginCorreo, f.values.loginPass);
            setOk(true);
            setLoader(`¡Bienvenido, ${user.nombre}!`);
            await delay(650);
            const from = loc.state?.from;
            nav(typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : homeFor(user.rol), { replace: true });
        }
    }
    finally {
        setLoader('');
        f.setValues(v => ({ ...v, regPass: '', loginPass: '' }));
    } }); }
    Object.assign(m.props, { tabIniciar: { className: tab === 'iniciar' ? 'active' : '' }, tabRegistrar: { className: tab === 'registrar' ? 'active' : '' }, seccionIniciar: { className: `form-section ${tab === 'iniciar' ? 'active' : ''}` }, seccionRegistrar: { className: `form-section ${tab === 'registrar' ? 'active' : ''}` }, formLogin: { ...onSubmit(() => submit(false)), className: `form-card ${a.error && tab === 'iniciar' ? 'shake' : ''}` }, formRegister: { ...onSubmit(() => submit(true)), className: `form-card ${a.error && tab === 'registrar' ? 'shake' : ''}` }, loaderOverlay: { hidden: !loader, 'data-estado': ok ? 'ok' : undefined } });
    for (const k of ['loginCorreo', 'loginPass', 'regNombre', 'regCorreo', 'regPass'])
        m.props[k] = f.field(k);
    m.props.regPass.minLength = 6;
    m.props.loginPass.autoComplete = 'current-password';
    m.props.regPass.autoComplete = 'new-password';
    m.content = { msgLogin: tab === 'iniciar' ? a.error : '', msgRegister: tab === 'registrar' ? a.error : '', loaderText: loader };
    return { ...m, busy: a.busy };
}
