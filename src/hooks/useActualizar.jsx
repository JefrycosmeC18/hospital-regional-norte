import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { object, requireFields } from '../services/api';
import { useResource, useAction } from './useResource';
import { date, editable } from '../services/domain';
import { calcularMontoServicio as tariff, formatearSoles as money } from '../services/tarifario';
import { useBase, hidden, onSubmit, useFields, initial, citaBody } from './modelUtils';
export function useActualizar() { const m = useBase(), a = useAction(), [params] = useSearchParams(), id = params.get('id'), r = useResource(id ? `/citas/${encodeURIComponent(id)}` : null, 'cita', 'object'), f = useFields(initial); useEffect(() => { if (r.data)
    f.setValues({ nombre: r.data.nombre_paciente ?? '', dni: r.data.dni ?? '', especialidad: r.data.especialidad ?? '', fecha_preferida: date(r.data.fecha_preferida), pago: r.data.tiene_sis ? 'sis' : 'particular' }); }, [r.data]); const allowed = editable(r.data), v = f.values; for (const [k, n] of Object.entries({ nombre: 'nombre', dni: 'dni', especialidad: 'especialidad', 'fecha-preferida': 'fecha_preferida' }))
    m.props[k] = { ...f.field(n), disabled: !allowed || a.busy }; m.radio = (k, v) => ({ ...f.radio(k, v), disabled: !allowed || a.busy }); m.props = { ...m.props, regId: { value: id ?? '', readOnly: true }, confirmBox: { hidden: !a.success, className: `confirm-box ${a.success ? 'show' : ''}` }, avisoSoloLectura: hidden(allowed), actualizarForm: onSubmit(() => { if (!allowed)
        return; a.run(async (ok) => { const response = await m.api(`/citas/${encodeURIComponent(id)}`, { method: 'PATCH', body: citaBody(v) }); requireFields(object(response, 'cita'), ['id']); ok('¡Listo! Actualizamos los datos de tu cita.'); r.reload(); }); }) }; m.content = { confirmTexto: a.success, avisoTexto: r.loading ? 'Cargando cita…' : r.error || (!id ? 'Falta el identificador de cita.' : 'Esta cita no permite cambios.'), 'monto-estimado': money(r.data?.estado_pago === 'pagado' ? Number(r.data.monto_calculado) : tariff(v)) }; return { ...m, busy: a.busy || !allowed, error: a.error || r.error }; }
