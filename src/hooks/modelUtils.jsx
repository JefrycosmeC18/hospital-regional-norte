import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { object, requireFields } from '../services/api';
export function useBase() { const { user, api, login } = useAuth(); const [menu, setMenu] = useState(false); return { user, api, login, menu, setMenu, props: {}, content: {}, busy: false, error: '' }; }
const bind = (value, setValue) => ({ value, onChange: e => setValue(e.target.value) });
const check = (value, setValue) => ({ checked: !!value, onChange: e => setValue(e.target.checked) });
const click = onClick => ({ onClick });
const hidden = v => ({ hidden: !!v });
const onSubmit = fn => ({ onSubmit: e => { e.preventDefault(); fn(e); } });
function useFields(initial) { const [values, setValues] = useState(initial); const update = (k, v) => setValues(o => ({ ...o, [k]: v })); return { values, setValues, field: (k, format = v => v) => bind(values[k] ?? '', v => update(k, format(v))), check: k => check(values[k], v => update(k, v)), radio: (k, v) => ({ checked: values[k] === v, onChange: () => update(k, v) }) }; }
const message = (r) => r.loading ? 'Cargando información…' : r.error ? 'No se pudo cargar la información.' : `${r.data?.length ?? 0} resultados`;
const resultCita = (raw) => requireFields(object(raw, 'cita'), ['id', 'codigo_seguimiento', 'estado_pago', 'monto_calculado']);
const initial = { nombre: '', dni: '', fecha_nacimiento: '', telefono: '', correo: '', especialidad: '', fecha_preferida: '', pago: 'sis', motivo: '' };
function citaBody(v) { return { nombre_paciente: v.nombre, dni: v.dni, especialidad: v.especialidad, fecha_preferida: v.fecha_preferida, tiene_sis: v.pago === 'sis' }; }
export { bind, check, click, hidden, onSubmit, useFields, message, resultCita, initial, citaBody };
