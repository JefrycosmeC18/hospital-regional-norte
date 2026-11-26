import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { object, requireFields } from '../services/api';
import { useResource, useAction } from './useResource';
import { payable } from '../services/domain';
import { formatearSoles as money } from '../services/tarifario';
import { validarFormularioTarjeta, formatearNumeroTarjeta, formatearVencimiento, detectarMarca, soloDigitos, validarCelular, validarCodigoAprobacion } from '../services/validaciones';
import { useBase, bind, hidden, onSubmit, useFields } from './modelUtils';
export function usePago() {
    const m = useBase(), a = useAction(), r = useResource('/citas/mias', 'citas'), [params] = useSearchParams(), nav = useNavigate(), [id, setId] = useState(params.get('id') ?? ''), [method, setMethod] = useState('tarjeta'), [flip, setFlip] = useState(false), [errors, setErrors] = useState({}), f = useFields({ numero: '', vencimiento: '', cvv: '', titular: '', proveedor: 'andipay', celular: '', codigo: '' });
    const pending = (r.data ?? []).filter(payable), selected = pending.find(x => String(x.id) === id), v = f.values, brand = detectarMarca(v.numero);
    useEffect(() => { if (r.data && !pending.some(x => String(x.id) === id))
        setId(String(pending[0]?.id ?? '')); }, [r.data, id]);
    async function pay(kind) { if (!selected)
        return; setErrors({}); const issues = {}; if (kind === 'tarjeta') {
        const test = validarFormularioTarjeta(v);
        Object.assign(issues, test.errores);
    }
    else {
        if (!validarCelular(v.celular))
            issues.celular = 'Celular inválido.';
        if (!validarCodigoAprobacion(v.codigo))
            issues.codigo = 'Código de 6 dígitos requerido.';
    } if (Object.keys(issues).length) {
        setErrors(issues);
        return;
    } await a.run(async () => { try {
        const body = kind === 'tarjeta' ? { id_registro: selected.id, metodo: kind, numero: soloDigitos(v.numero), vencimiento: v.vencimiento, cvv: v.cvv, titular: v.titular } : { id_registro: selected.id, metodo: kind, proveedor: v.proveedor, celular: v.celular, codigo_aprobacion: v.codigo };
        const result = requireFields(object(await m.api('/pagos/pasarela', { method: 'POST', body }), 'pago'), ['estado', 'codigo_operacion']);
        if (result.estado !== 'aprobado')
            throw new Error('El backend no aprobó el pago.');
        nav(`/comprobante?op=${encodeURIComponent(result.codigo_operacion)}`);
    }
    finally {
        f.setValues(x => ({ ...x, numero: '', cvv: '', vencimiento: '', titular: '', celular: '', codigo: '' }));
    } }); }
    m.radio = (k, value) => ({ checked: method === value, onChange: () => { setMethod(value); setErrors({}); } });
    m.props = { 'bloque-pago': hidden(!selected), registro: bind(id, setId), 'form-tarjeta': { hidden: method !== 'tarjeta', ...onSubmit(() => pay('tarjeta')) }, 'form-billetera': { hidden: method !== 'billetera', ...onSubmit(() => pay('billetera')) }, numero: f.field('numero', formatearNumeroTarjeta), vencimiento: f.field('vencimiento', formatearVencimiento), cvv: { ...f.field('cvv', x => soloDigitos(x).slice(0, 4)), onFocus: () => setFlip(true), onBlur: () => setFlip(false) }, titular: f.field('titular'), proveedor: f.field('proveedor'), celular: f.field('celular', x => soloDigitos(x).slice(0, 9)), codigo: { ...f.field('codigo', x => soloDigitos(x).slice(0, 6)), type: 'password' }, 'tarjeta-visual': { className: `tarjeta ${flip ? 'volteada' : ''}`, 'data-marca': brand ?? '', hidden: method !== 'tarjeta' } };
    const total = selected ? money(Number(selected.monto_calculado)) : '—';
    m.content = { 'mensaje-pago': a.busy ? 'Procesando con la entidad de pruebas…' : r.loading ? 'Cargando citas pendientes…' : r.error ? 'No se pudieron consultar las citas.' : !pending.length ? 'No tienes citas pendientes de pago.' : 'Entorno académico: utiliza exclusivamente datos de prueba. No ingreses tarjetas ni códigos reales.', registro: pending.map(x => <option key={x.id} value={x.id}>{x.codigo_seguimiento} — {money(Number(x.monto_calculado))}</option>), 'resumen-monto': total, 'marca-detectada': brand ?? '', 'tv-marca': brand ?? '—', 'tv-numero': v.numero ? '•••• •••• •••• ' + soloDigitos(v.numero).slice(-4) : '•••• •••• •••• ••••', 'tv-titular': v.titular || 'NOMBRE APELLIDO', 'tv-venc': v.vencimiento || 'MM/AA', 'tv-cvv': '•••', 'lat-codigo': selected?.codigo_seguimiento ?? '—', 'lat-medio': method === 'tarjeta' ? 'Tarjeta de débito o crédito' : 'Billetera electrónica', 'lat-total': total };
    for (const k of ['numero', 'vencimiento', 'cvv', 'titular', 'celular', 'codigo'])
        m.content['error-' + k] = errors[k] ?? '';
    return { ...m, error: a.error || r.error, busy: a.busy || !selected };
}
