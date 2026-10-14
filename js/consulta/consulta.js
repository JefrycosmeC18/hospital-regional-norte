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

  (async function cargar() {
    try {
      const registros = await listarMisRegistros(usuarioActual.id);
      cargando.hidden = true;

      if (registros.length === 0) {
        vacio.hidden = false;
        tabla.hidden = true;
        return;
      }

      vacio.hidden = true;
      tabla.hidden = false;
      cuerpo.replaceChildren();

      registros.forEach(function (r) {
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
      });
    } catch (error) {
      cargando.hidden = true;
      console.error('Error al consultar registros:', error);
      vacio.hidden = false;
      vacio.textContent = 'No se pudieron cargar tus citas en este momento. Intenta de nuevo más tarde.';
      tabla.hidden = true;
    }
  })();
})();