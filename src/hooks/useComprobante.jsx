import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { homeFor } from '../context/AuthContext';
import { object } from '../services/api';
import { useResource } from './useResource';
import { Receipt } from '../components/Clinical';
import { useBase } from './modelUtils';
export function useComprobante() { const m = useBase(), [params] = useSearchParams(), op = params.get('op'), r = useResource(op ? `/pagos/comprobante/${encodeURIComponent(op)}` : null, 'pago', 'object'); m.props = { imprimir: { disabled: r.data?.estado !== 'aprobado', onClick: () => window.print() }, volver: { to: m.user?.rol === 'cliente' ? '/consulta' : homeFor(m.user?.rol) } }; m.content = { comprobante: r.loading ? 'Cargando comprobante…' : r.data && r.data.estado === 'aprobado' ? <Receipt p={r.data}/> : r.error ? 'Comprobante no disponible.' : 'Falta el código de operación.' }; return { ...m, error: r.error }; }
