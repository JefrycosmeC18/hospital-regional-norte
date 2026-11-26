import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAction } from './useResource';
import { specialties, today, payable } from '../services/domain';
import { calcularMontoServicio as tariff, formatearSoles as money } from '../services/tarifario';
import { useBase, hidden, onSubmit, useFields, resultCita, initial, citaBody } from './modelUtils';
export function useRegistro() {
    const m = useBase(), a = useAction(), f = useFields(initial), [step, setStep] = useState(1), [validation, setValidation] = useState(''), [saved, setSaved] = useState(null), [history, setHistory] = useState(() => { try {
        return JSON.parse(sessionStorage.getItem(`hrn.history.${m.user?.id}`)) || [];
    }
    catch {
        return [];
    } }), nav = useNavigate();
    const v = f.values;
    useEffect(() => { try {
        sessionStorage.setItem(`hrn.history.${m.user?.id}`, JSON.stringify(history));
    }
    catch { } }, [history, m.user?.id]);
    useEffect(() => { if (!saved)
        return; const timer = setTimeout(() => nav(payable(saved) ? `/pago?id=${saved.id}` : '/consulta'), 3500); return () => clearTimeout(timer); }, [saved, nav]);
    const form = useRef(null);
    function valid(n) { const controls = [...form.current.querySelectorAll(`[data-paso="${n}"] input,[data-paso="${n}"] select,[data-paso="${n}"] textarea`)]; return controls.every(x => x.checkValidity()); }
    function next() { if (!valid(step)) {
        setValidation('Revisa los campos requeridos antes de continuar.');
        return;
    } if (step === 1 && v.fecha_nacimiento > today()) {
        setValidation('Fecha de nacimiento inválida.');
        return;
    } if (step === 2 && v.fecha_preferida < today()) {
        setValidation('La fecha preferida no puede ser anterior a hoy.');
        return;
    } setValidation(''); setStep(s => s + 1); }
    async function submit() { if (step !== 3) {
        next();
        return;
    } if (!valid(1) || !valid(2)) {
        setValidation('Revisa los datos del formulario.');
        setStep(1);
        return;
    } await a.run(async () => { const r = resultCita(await m.api('/citas', { method: 'POST', body: { ...citaBody(v), fecha_nacimiento: v.fecha_nacimiento, telefono: v.telefono, correo: v.correo || null, motivo: v.motivo } })); setSaved(r); setHistory(h => [{ id: r.id, codigo_seguimiento: r.codigo_seguimiento, monto_calculado: r.monto_calculado }, ...h].slice(0, 30)); f.setValues(initial); setStep(1); }); }
    for (const [id, k] of Object.entries({ nombre: 'nombre', dni: 'dni', 'fecha-nacimiento': 'fecha_nacimiento', telefono: 'telefono', correo: 'correo', especialidad: 'especialidad', 'fecha-preferida': 'fecha_preferida', motivo: 'motivo' }))
        m.props[id] = f.field(k);
    m.props['fecha-nacimiento'].max = today();
    m.props['fecha-preferida'].min = today();
    m.radio = f.radio;
    m.step = step;
    m.props = { ...m.props, confirmBox: { hidden: !saved, className: `confirm-box ${saved ? 'show' : ''}` }, citaProgreso: { 'aria-valuenow': step }, citaProgresoBarra: { style: { width: `${step / 3 * 100}%` } }, citaForm: { ...onSubmit(submit), noValidate: true, ref: form }, pasoAnterior: { hidden: step === 1, onClick: () => { setStep(s => s - 1); setValidation(''); } }, pasoSiguiente: { hidden: step === 3, onClick: next }, pasoError: hidden(!validation), borrarSolicitudes: { hidden: !history.length, onClick: () => setHistory([]) }, misSolicitudesVacio: hidden(history.length > 0) };
    m.content = { confirmTexto: saved && <>Solicitud recibida: <strong>{saved.codigo_seguimiento}</strong> · {money(Number(saved.monto_calculado))} · <Link to="/consulta">Mis citas</Link>{payable(saved) && <> · <Link to={`/pago?id=${saved.id}`}>Pagar ticket</Link></>}</>, citaPasoEtiqueta: `Paso ${step} de 3 · ${['Datos del paciente', 'Datos de la cita', 'Registro y consulta'][step - 1]}`, 'monto-estimado': money(tariff(v)), 'monto-nota': v.pago === 'sis' ? 'Sujeto a verificación de SIS.' : 'Tarifa estimada, confirmada por el servidor.', resumenNombre: v.nombre, resumenEspecialidad: specialties[v.especialidad], resumenFecha: v.fecha_preferida, resumenPago: v.pago === 'sis' ? 'SIS' : 'Particular', resumenMonto: money(tariff(v)), pasoError: validation, misSolicitudesLista: history.map(r => <li className="my-requests-item" key={r.id}><span className="my-requests-name">{r.codigo_seguimiento}</span><span className="my-requests-detail">{money(Number(r.monto_calculado))} · <Link to="/consulta">Consultar</Link></span><span className="my-requests-status">Registrada por API</span></li>), misSolicitudesVacio: 'Aún no registras solicitudes en esta sesión del navegador.' };
    return { ...m, error: a.error, busy: a.busy };
}
