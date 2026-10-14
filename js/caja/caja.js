// js/caja/caja.js — script propio de caja.html (módulo del cajero)
// Tabla del caso 10: citas_medicas (ticket de consulta).

import { sql } from '../config/neon-config.js';
import { exigirRol, cerrarSesion } from '../auth/auth.js';
import { formatearSoles, redondear } from '../registro/tarifario.js';
import { generarCodigoOperacion } from '../pago/validaciones.js';

const usuario = exigirRol('cajero', 'administrador');
if (!usuario) throw new Error('Acceso denegado');

/* =========================================================
   A. DATOS — consultas a Neon
   ========================================================= */

async function buscarPendientes(criterio = '') {
  const patron = `%${criterio.trim()}%`;
  return await sql`
    SELECT r.id, r.id_usuario, r.codigo_seguimiento, r.monto_calculado, r.fecha_registro,
           COALESCE(u.nombre, r.nombre_paciente) AS cliente,
           COALESCE(u.dni, r.dni) AS dni
    FROM citas_medicas r
    LEFT JOIN usuarios u ON u.id = r.id_usuario       -- LEFT: incluye citas creadas en el panel
    WHERE r.estado_pago = 'pendiente'
      AND (r.codigo_seguimiento ILIKE ${patron}
           OR COALESCE(u.dni, r.dni) ILIKE ${patron}
           OR COALESCE(u.nombre, r.nombre_paciente) ILIKE ${patron})
    ORDER BY r.fecha_registro ASC
    LIMIT 50;
  `;
}

const METODOS_CAJA = {
  efectivo:  { metodo: 'efectivo',  proveedor: null },
  pos:       { metodo: 'pos',       proveedor: null },
  andipay:   { metodo: 'billetera', proveedor: 'andipay' },
  pagomovil: { metodo: 'billetera', proveedor: 'pagomovil' }
};

async function cobrarPresencial({ registro, opcion, montoRecibido, referencia }) {
  const { metodo, proveedor } = METODOS_CAJA[opcion];
  const monto = Number(registro.monto_calculado);
  let vuelto = null;

  if (metodo === 'efectivo') {
    if (!(montoRecibido >= monto)) throw new Error('El monto recibido es menor que el total.');
    vuelto = redondear(montoRecibido - monto);
    referencia = 'Efectivo';
  } else {
    montoRecibido = null;
    referencia = (metodo === 'pos' ? 'Voucher ' : 'Op. ') + referencia;
  }

  const codigo = generarCodigoOperacion('CJ');
  // INSERT del pago + UPDATE de la cita: se confirman juntos o ninguno
  await sql.transaction([
    sql`INSERT INTO pagos (codigo_operacion, id_registro, id_usuario, canal, metodo, proveedor_billetera,
                           referencia, monto, monto_recibido, vuelto, estado, id_cajero)
        VALUES (${codigo}, ${registro.id}, ${registro.id_usuario}, 'caja', ${metodo}, ${proveedor},
                ${referencia}, ${monto}, ${montoRecibido}, ${vuelto}, 'aprobado', ${usuario.id});`,
    sql`UPDATE citas_medicas
        SET estado_pago = 'pagado', canal_pago = 'caja', fecha_pago = NOW()
        WHERE id = ${registro.id} AND estado_pago = 'pendiente';`
  ]);
  return { codigo, vuelto };
}

// Pagos de la pasarela de una fecha, en hora de Lima (aprobados y rechazados)
async function listarPagosEnLinea(fecha, soloPorVerificar) {
  return await sql`
    SELECT p.id, p.codigo_operacion, p.metodo, p.proveedor_billetera, p.marca_tarjeta, p.referencia,
           p.monto, p.estado, p.motivo_rechazo, p.verificado, p.fecha_pago,
           r.codigo_seguimiento, u.nombre AS cliente, v.nombre AS verificador
    FROM pagos p
    JOIN citas_medicas r ON r.id = p.id_registro
    LEFT JOIN usuarios u ON u.id = p.id_usuario
    LEFT JOIN usuarios v ON v.id = p.verificado_por
    WHERE p.canal = 'pasarela'
      AND (p.fecha_pago AT TIME ZONE 'America/Lima')::date = ${fecha}::date
      AND (${soloPorVerificar} = false OR (p.estado = 'aprobado' AND p.verificado = false))
    ORDER BY p.fecha_pago DESC;
  `;
}

async function verificarPago(idPago) {
  await sql`
    UPDATE pagos
    SET verificado = true, verificado_por = ${usuario.id}, fecha_verificacion = NOW()
    WHERE id = ${idPago} AND canal = 'pasarela' AND estado = 'aprobado';
  `;
}

async function resumenDelDia(fecha) {
  return await sql`
    SELECT canal, metodo, COUNT(*)::int AS operaciones, SUM(monto) AS total
    FROM pagos
    WHERE estado = 'aprobado'
      AND (fecha_pago AT TIME ZONE 'America/Lima')::date = ${fecha}::date
    GROUP BY canal, metodo
    ORDER BY canal, metodo;
  `;
}

/* =========================================================
   B. INTERFAZ
   ========================================================= */

const $ = (selector) => document.querySelector(selector);
const tablaPendientes = $('#tabla-pendientes tbody');
const tablaEnLinea = $('#tabla-en-linea tbody');
const tablaResumen = $('#tabla-resumen tbody');
const dialogo = $('#dialogo-cobro');
const formCobro = $('#form-cobro');
const selectMetodo = $('#metodo-caja');
const inputRecibido = $('#monto-recibido');
const inputReferencia = $('#referencia');
const inputFecha = $('#fecha-caja');
const chkPorVerificar = $('#solo-por-verificar');
const resumenCobro = $('#cobro-resumen');
const btnRevisar = $('#btn-revisar');
const btnConfirmar = $('#btn-confirmar');
const btnVolver = $('#btn-volver');

$('#nombre-cajero').textContent = usuario.nombre;
$('#btnCerrarSesion').addEventListener('click', (e) => { e.preventDefault(); cerrarSesion(); });

// El administrador además puede volver a su panel
if (usuario.rol === 'administrador') $('.nav-link-panel').style.display = '';

// Fecha de HOY en Lima con formato AAAA-MM-DD (el que espera <input type="date">)
const hoyEnLima = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
inputFecha.value = hoyEnLima();

let pendientesCache = [];
let registroEnCobro = null;
let datosCobro = null;
let ultimoIdVisto = null;

function celda(fila, texto = '') {
  const td = document.createElement('td');
  td.textContent = texto ?? '—';       // textContent: nunca interpretar datos como HTML
  fila.append(td);
  return td;
}

function boton(texto, accion, id) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'btn-tabla';
  b.textContent = texto;
  b.dataset.accion = accion;
  b.dataset.id = id;
  return b;
}

function filaVacia(tbody, columnas, texto) {
  const tr = document.createElement('tr');
  const td = celda(tr, texto);
  td.colSpan = columnas;
  tbody.append(tr);
}

function describirMedio(p) {
  if (p.metodo === 'billetera') return `Billetera ${p.proveedor_billetera} ${p.referencia}`;
  if (p.marca_tarjeta) return `${p.marca_tarjeta} ${p.referencia}`;
  return p.referencia ?? p.metodo;
}

// ---- Cobro presencial ----
async function pintarPendientes(criterio = '') {
  pendientesCache = await buscarPendientes(criterio);
  tablaPendientes.replaceChildren();
  if (pendientesCache.length === 0) return filaVacia(tablaPendientes, 5, 'Sin citas pendientes de pago.');

  for (const r of pendientesCache) {
    const tr = document.createElement('tr');
    celda(tr, r.codigo_seguimiento);
    celda(tr, r.cliente ?? 'Atención presencial');
    celda(tr, r.dni);
    celda(tr, formatearSoles(Number(r.monto_calculado)));
    celda(tr).append(boton('Cobrar', 'cobrar', r.id));
    tablaPendientes.append(tr);
  }
}

$('#form-buscar').addEventListener('submit', (e) => {
  e.preventDefault();
  pintarPendientes(new FormData(e.target).get('criterio'));
});

function ajustarCamposMetodo() {
  const esEfectivo = selectMetodo.value === 'efectivo';
  $('#campo-recibido').hidden = !esEfectivo;
  $('#campo-referencia').hidden = esEfectivo;
  inputRecibido.required = esEfectivo;
  inputReferencia.required = !esEfectivo;
  $('#vuelto').textContent = formatearSoles(0);
}

function volverAEdicion() {
  resumenCobro.hidden = true;
  btnConfirmar.hidden = true;
  btnVolver.hidden = true;
  btnRevisar.hidden = false;
  formCobro.querySelectorAll('input, select').forEach(c => { c.disabled = false; });
}

selectMetodo.addEventListener('change', ajustarCamposMetodo);

inputRecibido.addEventListener('input', () => {
  const vuelto = Number(inputRecibido.value) - Number(registroEnCobro.monto_calculado);
  $('#vuelto').textContent = vuelto >= 0 ? formatearSoles(redondear(vuelto)) : 'Monto insuficiente';
});

// Delegación de eventos: un solo listener para todos los botones "Cobrar"
tablaPendientes.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-accion="cobrar"]');
  if (!b) return;
  registroEnCobro = pendientesCache.find(r => r.id === Number(b.dataset.id));
  $('#cobro-codigo').textContent = registroEnCobro.codigo_seguimiento;
  $('#cobro-total').textContent = formatearSoles(Number(registroEnCobro.monto_calculado));
  formCobro.reset();
  volverAEdicion();
  ajustarCamposMetodo();
  dialogo.showModal();
});

$('#cancelar-cobro').addEventListener('click', () => dialogo.close());
btnVolver.addEventListener('click', volverAEdicion);

// Paso 1 del cobro: validar y mostrar el resumen para confirmar (todo dentro del diálogo)
formCobro.addEventListener('submit', (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(formCobro));

  if (datos.metodo === 'efectivo') {
    if (!(Number(datos.monto_recibido) >= Number(registroEnCobro.monto_calculado))) {
      alert('El monto recibido es menor que el total a cobrar.');
      return;
    }
  } else if (!/^\d{6,12}$/.test(datos.referencia)) {
    alert('Ingresa el número de voucher u operación (6 a 12 dígitos).');
    return;
  }

  datosCobro = datos;
  const total = formatearSoles(Number(registroEnCobro.monto_calculado));
  resumenCobro.textContent =
    `¿Confirmar el cobro de ${total} de la cita ${registroEnCobro.codigo_seguimiento} (${selectMetodo.selectedOptions[0].textContent})?`;
  resumenCobro.hidden = false;
  btnRevisar.hidden = true;
  btnConfirmar.hidden = false;
  btnVolver.hidden = false;
  formCobro.querySelectorAll('input, select').forEach(c => { c.disabled = true; });
});

// Paso 2: confirmar y registrar en Neon
btnConfirmar.addEventListener('click', async () => {
  btnConfirmar.disabled = true;
  btnConfirmar.classList.add('is-loading');
  try {
    const { codigo, vuelto } = await cobrarPresencial({
      registro: registroEnCobro,
      opcion: datosCobro.metodo,
      montoRecibido: Number(datosCobro.monto_recibido),
      referencia: datosCobro.referencia
    });
    dialogo.close();
    alert(`Cobro registrado. Operación ${codigo}.` + (vuelto !== null ? ` Vuelto: ${formatearSoles(vuelto)}.` : ''));
    window.open(`comprobante.html?op=${encodeURIComponent(codigo)}`, '_blank');
    await Promise.all([pintarPendientes($('#criterio').value), refrescar()]);
  } catch (error) {
    console.error(error);
    volverAEdicion();
    alert(error.code === '23505' ? 'Esta cita ya fue pagada.' : (error.message || 'No se pudo registrar el cobro.'));
  } finally {
    btnConfirmar.disabled = false;
    btnConfirmar.classList.remove('is-loading');
  }
});

// ---- Pagos en línea (lo que el paciente pagó por la pasarela) ----
async function pintarPagosEnLinea() {
  const pagos = await listarPagosEnLinea(inputFecha.value, chkPorVerificar.checked);
  tablaEnLinea.replaceChildren();
  if (pagos.length === 0) filaVacia(tablaEnLinea, 8, 'Sin operaciones en línea para esta fecha.');

  for (const p of pagos) {
    const tr = document.createElement('tr');
    if (p.estado === 'rechazado') tr.className = 'fila-rechazada';
    celda(tr, new Date(p.fecha_pago).toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit' }));
    celda(tr, p.codigo_operacion);
    celda(tr, p.codigo_seguimiento);
    celda(tr, p.cliente);
    celda(tr, describirMedio(p));
    celda(tr, formatearSoles(Number(p.monto)));
    celda(tr, p.estado === 'aprobado' ? 'Aprobado' : `Rechazado: ${p.motivo_rechazo}`);
    const tdAccion = celda(tr);
    if (p.estado === 'aprobado' && !p.verificado) tdAccion.append(boton('Verificar', 'verificar', p.id));
    else if (p.verificado) tdAccion.textContent = `Verificado por ${p.verificador}`;
    tablaEnLinea.append(tr);
  }

  // Aviso de pagos nuevos desde la última revisión
  const idsAprobados = pagos.filter(p => p.estado === 'aprobado').map(p => p.id);
  const maxId = idsAprobados.length ? Math.max(...idsAprobados) : 0;
  if (ultimoIdVisto !== null && maxId > ultimoIdVisto) {
    const nuevos = idsAprobados.filter(id => id > ultimoIdVisto).length;
    $('#aviso-nuevos').textContent = `Ingresaron ${nuevos} pago(s) nuevo(s) por la pasarela.`;
  }
  ultimoIdVisto = Math.max(ultimoIdVisto ?? 0, maxId);
}

tablaEnLinea.addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-accion="verificar"]');
  if (!b) return;
  if (!confirm('¿Confirmas que este pago figura en el estado de cuenta de la entidad?')) return;
  await verificarPago(Number(b.dataset.id));
  await pintarPagosEnLinea();
});

// ---- Resumen del día ----
async function pintarResumen() {
  const filas = await resumenDelDia(inputFecha.value);
  tablaResumen.replaceChildren();
  let total = 0;
  if (filas.length === 0) filaVacia(tablaResumen, 4, 'Sin cobros aprobados en esta fecha.');
  for (const f of filas) {
    const tr = document.createElement('tr');
    celda(tr, f.canal === 'pasarela' ? 'En línea' : 'Ventanilla');
    celda(tr, f.metodo);
    celda(tr, String(f.operaciones));
    celda(tr, formatearSoles(Number(f.total)));
    tablaResumen.append(tr);
    total += Number(f.total);
  }
  $('#total-dia').textContent = formatearSoles(redondear(total));
}

async function refrescar() {
  try {
    await Promise.all([pintarPagosEnLinea(), pintarResumen()]);
  } catch (error) {
    console.error(error);
  }
}

inputFecha.addEventListener('change', () => { ultimoIdVisto = null; refrescar(); });
chkPorVerificar.addEventListener('change', refrescar);

// Revisa cada 15 segundos si entraron pagos por la pasarela (solo con la pestaña visible)
setInterval(() => { if (!document.hidden) refrescar(); }, 15000);

pintarPendientes();
refrescar();