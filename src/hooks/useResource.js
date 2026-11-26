import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { list, object } from '../services/api';
// Cada solicitud tiene su propio identificador. No se muestra información de una ruta anterior.
export function useResource(path, key, kind = 'list', interval = 0) {
    const { api } = useAuth();
    const [state, setState] = useState({ path: null, version: -1, api: null, data: null, loading: !!path, error: '' });
    const [version, setVersion] = useState(0);
    const reload = useCallback(() => setVersion(v => v + 1), []);
    useEffect(() => {
        if (!path)
            return;
        let active = true, controller;
        async function load(first) {
            controller?.abort();
            const current = new AbortController();
            controller = current;
            if (first)
                setState({ path, version, api, data: null, loading: true, error: '' });
            try {
                const result = await api(path, { signal: current.signal });
                const data = kind === 'list' ? list(result, key) : object(result, key);
                if (active && !current.signal.aborted)
                    setState({ path, version, api, data, loading: false, error: '' });
            }
            catch (e) {
                if (active && !current.signal.aborted && e.name !== 'AbortError')
                    setState({ path, version, api, data: null, loading: false, error: e.message });
            }
        }
        load(true);
        const timer = interval ? setInterval(() => load(false), interval) : null;
        return () => { active = false; controller?.abort(); if (timer)
            clearInterval(timer); };
    }, [api, path, key, kind, version, interval]);
    const current = path && state.path === path && state.version === version && state.api === api ? state : { data: null, loading: !!path, error: '' };
    return { data: current.data, loading: current.loading, error: current.error, reload };
}
export function useAction() {
    const lock = useRef(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const run = async (fn) => { if (lock.current)
        return; lock.current = true; setBusy(true); setError(''); setSuccess(''); try {
        return await fn(setSuccess);
    }
    catch (e) {
        setError(e.message || 'Error inesperado');
    }
    finally {
        lock.current = false;
        setBusy(false);
    } };
    return { busy, error, success, run, setError, setSuccess };
}
