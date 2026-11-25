// js/consulta/consulta.js
// Script propio de consulta.html — RF-10.5: lista, mediante SELECT ... WHERE id_usuario,
// únicamente las citas del paciente en sesión. Semana 9: muestra el monto, el estado de pago
// y la acción que corresponde (Pagar / Ver comprobante / Exonerado).

import { sql } from '../config/neon-config.js';
import { exigirRol, cerrarSesion } from '../auth/auth.js';
import { formatearSoles } from '../registro/tarifario.js';

const usuarioActual = exigirRol('cliente');
if (!usuarioActual) throw new Error('Acceso denegado');

export async function listarMisRegistros(idUsuario) {
  return await sql`
    SELECT r.id, r.codigo_seguimiento, r.especialidad, r.fecha_preferida, r.estado,
           r.estado_pago, r.canal_pago, r.monto_calculado,
           (r.fecha_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Lima') AS fecha_registro,
           p.codigo_operacion
    FROM citas_medicas r
    LEFT JOIN pagos p ON p.id_registro = r.id AND p.estado = 'aprobado'
    WHERE r.id_usuario = ${idUsuario}
    ORDER BY r.fecha_registro DESC;
  `;
}

const NOMBRES_ESPECIALIDAD = {
  'medicina-general': 'Medicina General', 'pediatria': 'Pediatría',
  'ginecologia': 'Ginecología y Obstetricia', 'cardiologia': 'Cardiología',
  'traumatologia': 'Traumatología', 'cirugia-general': 'Cirugía General',
  'medicina-interna': 'Medicina Interna', 'odontologia': 'Odontología',
  'oftalmologia': 'Oftalmología', 'psicologia': 'Psicología'
};

// Acepta Date (lo que devuelve el driver de Neon) o texto 'AAAA-MM-DD'.
// Nunca se hace new Date('2026-10-13'): se leería como medianoche UTC y en Lima sería el día anterior.
function formatearFecha(valor) {
  if (!valor) return 'Sin especificar';
  if (typeof valor === 'string') {
    const [a, m, d] = valor.slice(0, 10).split('-');
    return `${d}/${m}/${a}`;
  }
  return valor.toLocaleDateString('es-PE');   // Date local: se muestra el mismo día
}

// Celdas armadas con createElement + textContent: nunca se interpretan datos como HTML
function celda(fila, texto = '') {
  const td = document.createElement('td');
  td.textContent = texto;
  fila.append(td);
  return td;
}

function insignia(clase, atributo, valor, texto) {
  const span = document.createElement('span');
  span.className = clase;
  span.dataset[atributo] = valor;
  span.textContent = texto;
  return span;
}

function accionEditar(td, r) {
  const editable = r.estado === 'registrado' && r.estado_pago !== 'pagado';
  if (editable) {
    const a = document.createElement('a');
    a.className = 'btn-editar-fila';
    a.href = `actualizar.html?id=${r.id}`;
    a.textContent = 'Editar';
    td.append(a);
  } else {
    const s = document.createElement('span');
    s.className = 'btn-editar-fila';
    s.setAttribute('aria-disabled', 'true');
    s.textContent = 'Editar';
    td.append(s);
  }
}

function accionDePago(td, r) {
  if (r.estado_pago === 'pendiente') {
    const a = document.createElement('a');
    a.className = 'btn-pagar-fila';
    a.href = `pago.html?id=${r.id}`;
    a.textContent = 'Pagar';
    td.append(a);
  } else if (r.estado_pago === 'pagado' && r.codigo_operacion) {
    const a = document.createElement('a');
    a.className = 'btn-comprobante-fila';
    a.href = `comprobante.html?op=${encodeURIComponent(r.codigo_operacion)}`;
    a.textContent = 'Ver comprobante';
    td.append(a);
  }
}

(function () {
  const lblBienvenida = document.getElementById('usuarioBienvenida');
  if (lblBienvenida) {
    lblBienvenida.textContent = `Paciente autenticado: ${usuarioActual.nombre} (${usuarioActual.correo})`;
  }

  document.getElementById('btnCerrarSesion')?.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarSesion();
  });

  const tabla = document.getElementById('tablaRegistros');
  const cuerpo = document.getElementById('cuerpoRegistros');
  const vacio = document.getElementById('registrosVacio');
  const cargando = document.getElementById('cargando'); // esqueleto shimmer

  const tarjetas = document.getElementById('tarjetasMisCitas');
  const buscar = document.getElementById('buscarMisCitas');
  const estadoFiltro = document.getElementById('estadoMisCitas');
  const limpiar = document.getElementById('limpiarMisCitas');
  const contador = document.getElementById('contadorMisCitas');
  const tablaDetalle = document.getElementById('detalleTablaMisCitas');
  let registrosCache = [];

  const normalizar = (valor) => String(valor ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  function mostrarTarjeta(r) {
    const card = document.createElement('article');
    card.className = 'mis-cita-card';
    card.dataset.estado = r.estado;

    const cabecera = document.createElement('div');
    cabecera.className = 'mis-cita-card-top';
    const titulo = document.createElement('h3');
    titulo.textContent = NOMBRES_ESPECIALIDAD[r.especialidad] || r.especialidad;
    cabecera.append(titulo, insignia('estado-badge', 'estado', r.estado, r.estado));

    const codigo = document.createElement('p');
    codigo.className = 'mis-cita-codigo';
    codigo.textContent = 'Código de seguimiento: ' + (r.codigo_seguimiento || '—');

    const detalles = document.createElement('dl');
    detalles.className = 'mis-cita-detalles';
    function dato(etiqueta, valor) {
      const contenedor = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = etiqueta;
      dd.textContent = valor;
      contenedor.append(dt, dd);
      detalles.append(contenedor);
    }
    dato('Fecha preferida', formatearFecha(r.fecha_preferida));
    dato('Fecha de registro', formatearFecha(r.fecha_registro));
    dato('Monto', r.estado_pago === 'exonerado' ? 'S/ 0.00' : formatearSoles(Number(r.monto_calculado)));
    const pago = document.createElement('div');
    const pagoDt = document.createElement('dt');
    pagoDt.textContent = 'Estado del pago';
    const pagoDd = document.createElement('dd');
    pagoDd.append(insignia('pago-badge', 'pago', r.estado_pago, r.estado_pago));
    pago.append(pagoDt, pagoDd);
    detalles.append(pago);

    const acciones = document.createElement('div');
    acciones.className = 'mis-cita-acciones';
    accionEditar(acciones, r);
    accionDePago(acciones, r);
    card.append(cabecera, codigo, detalles, acciones);
    return card;
  }

  function mostrarTabla(registros) {
    cuerpo.replaceChildren();
    for (const r of registros) {
      const tr = document.createElement('tr');
      celda(tr, r.codigo_seguimiento);
      celda(tr, NOMBRES_ESPECIALIDAD[r.especialidad] || r.especialidad);
      celda(tr, formatearFecha(r.fecha_preferida));
      celda(tr).append(insignia('estado-badge', 'estado', r.estado, r.estado));
      celda(tr, r.estado_pago === 'exonerado' ? 'S/ 0.00' : formatearSoles(Number(r.monto_calculado)));
      celda(tr).append(insignia('pago-badge', 'pago', r.estado_pago, r.estado_pago));
      celda(tr, formatearFecha(r.fecha_registro));
      const tdAcciones = celda(tr);
      tdAcciones.className = 'acciones-fila';
      accionEditar(tdAcciones, r);
      accionDePago(tdAcciones, r);
      cuerpo.append(tr);
    }
  }

  function aplicarFiltros() {
    const palabra = normalizar(buscar.value);
    const estado = estadoFiltro.value;
    const filtrados = registrosCache.filter(r => {
      const criterio = normalizar((r.codigo_seguimiento || '') + ' ' +
        (NOMBRES_ESPECIALIDAD[r.especialidad] || r.especialidad));
      return (!palabra || criterio.includes(palabra)) && (!estado || r.estado === estado);
    });
    tarjetas.replaceChildren();
    for (const r of filtrados) tarjetas.append(mostrarTarjeta(r));
    mostrarTabla(filtrados);
    const vacioTotal = registrosCache.length === 0;
    vacio.hidden = !vacioTotal && filtrados.length > 0;
    vacio.replaceChildren();
    if (vacioTotal) {
      vacio.append('Todavía no tienes solicitudes de cita registradas. ');
      const enlace = document.createElement('a');
      enlace.href = 'registro.html';
      enlace.textContent = 'Solicita una cita';
      vacio.append(enlace);
    } else {
      vacio.textContent = 'No encontramos citas que coincidan con los filtros.';
    }
    tablaDetalle.hidden = filtrados.length === 0;
    tabla.hidden = filtrados.length === 0;
    contador.textContent = 'Mostrando ' + filtrados.length + ' de ' + registrosCache.length + ' citas';
  }
  buscar.addEventListener('input', aplicarFiltros);
  estadoFiltro.addEventListener('change', aplicarFiltros);
  limpiar.addEventListener('click', () => {
    buscar.value = '';
    estadoFiltro.value = '';
    aplicarFiltros();
    buscar.focus();
  });


  (async function cargar() {
    try {
      const registros = await listarMisRegistros(usuarioActual.id);
      cargando.hidden = true;

      registrosCache = registros;
      aplicarFiltros();
    } catch (error) {
      cargando.hidden = true;
      console.error('Error al consultar registros:', error);
      vacio.hidden = false;
      vacio.textContent = 'No se pudieron cargar tus citas en este momento. Intenta de nuevo más tarde.';
      contador.textContent = 'No se pudo actualizar la lista.';
      tablaDetalle.hidden = true;
      tabla.hidden = true;
    }
  })();
})();