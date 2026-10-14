// js/panel/panel.js
// Script propio de panel.html — RF-10.7 y RF-10.8: administrador y
// empleado comparten el mismo panel con las cuatro operaciones sobre
// TODOS los registros de citas_medicas (no solo los propios).

import { sql } from '../config/neon-config.js';
import { verificarPanelProtegido, cerrarSesion } from '../auth/auth.js';
import { calcularMontoServicio, datosDeTarifa, formatearSoles } from '../registro/tarifario.js';

// Exige sesión Y rol administrador/empleado; si es cliente, lo redirige.
const usuarioActual = verificarPanelProtegido();

const ESTADOS = ['registrado', 'atendido', 'rechazado', 'cancelado'];

// --- Turnos de empleado (requisito de la Evaluación Parcial) ---
// El administrador siempre puede editar, sin importar la hora.
// El empleado solo puede editar el estado mientras la hora actual
// caiga dentro de SU turno asignado (mañana / tarde / noche-madrugada).
const TURNOS_HORARIO = {
  'mañana': { desde: 6, hasta: 14 },           // 06:00 a 13:59
  'tarde': { desde: 14, hasta: 22 },           // 14:00 a 21:59
  'noche-madrugada': { desde: 22, hasta: 6 }   // 22:00 a 05:59 (cruza medianoche)
};

function turnoActual() {
  const hora = new Date().getHours();
  if (hora >= 6 && hora < 14) return 'mañana';
  if (hora >= 14 && hora < 22) return 'tarde';
  return 'noche-madrugada';
}

function puedeEditarAhora() {
  if (usuarioActual.rol === 'administrador') return true;
  // Empleado: solo si su turno asignado coincide con la hora actual.
  return usuarioActual.turno === turnoActual();
}

const NOMBRES_ESPECIALIDAD = {
  'medicina-general': 'Medicina General',
  'pediatria': 'Pediatría',
  'ginecologia': 'Ginecología y Obstetricia',
  'cardiologia': 'Cardiología',
  'traumatologia': 'Traumatología',
  'cirugia-general': 'Cirugía General',
  'medicina-interna': 'Medicina Interna',
  'odontologia': 'Odontología',
  'oftalmologia': 'Oftalmología',
  'psicologia': 'Psicología'
};

// --- Consultar: todos los registros, sin filtrar por usuario ---
export async function listarTodos() {
  return await sql`
    SELECT id, codigo_seguimiento, nombre_paciente, dni, especialidad, fecha_preferida, estado,
           estado_pago, canal_pago, monto_calculado, tiene_sis
    FROM citas_medicas
    ORDER BY fecha_registro DESC;
  `;
}

// --- Crear: el panel también registra citas sin cuenta de paciente ---
export async function crearRegistro(datos) {
  const codigo = 'COD-' + Date.now().toString().slice(-8);
  const { tipo_consulta, tiene_sis } = datosDeTarifa(datos);
  const monto = calcularMontoServicio(datos);
  await sql`
    INSERT INTO citas_medicas (codigo_seguimiento, nombre_paciente, dni, especialidad, fecha_preferida, estado,
                               tipo_consulta, tiene_sis, monto_calculado, estado_pago)
    VALUES (${codigo}, ${datos.nombre}, ${datos.dni}, ${datos.especialidad}, ${datos.fecha_preferida}, 'registrado',
            ${tipo_consulta}, ${tiene_sis}, ${monto}, ${monto === 0 ? 'exonerado' : 'pendiente'});
  `;
  return codigo;   // el paciente presencial paga luego en caja.html buscando este código
}

// --- Actualizar: cualquier registro, incluido el estado ---
export async function actualizarComoPanel(id, datos) {
  if (!puedeEditarAhora()) {
    throw new Error('Estás fuera de tu turno asignado y no puedes editar en este momento.');
  }
  const { tipo_consulta } = datosDeTarifa({ especialidad: datos.especialidad, tiene_sis: datos.tiene_sis });
  const monto = calcularMontoServicio({ especialidad: datos.especialidad, tiene_sis: datos.tiene_sis });
  // El panel NO cambia estado_pago a mano: los pagos nacen solo en la pasarela o en caja.
  // Si la cita ya está pagada, su monto y su estado de pago no se tocan.
  await sql`
    UPDATE citas_medicas
    SET nombre_paciente = ${datos.nombre_paciente},
        dni = ${datos.dni},
        especialidad = ${datos.especialidad},
        fecha_preferida = ${datos.fecha_preferida},
        estado = ${datos.estado},
        tipo_consulta   = CASE WHEN estado_pago = 'pagado' THEN tipo_consulta ELSE ${tipo_consulta} END,
        monto_calculado = CASE WHEN estado_pago = 'pagado' THEN monto_calculado ELSE ${monto} END,
        estado_pago     = CASE WHEN estado_pago = 'pagado' THEN estado_pago
                               WHEN tiene_sis THEN 'exonerado' ELSE 'pendiente' END
    WHERE id = ${id};
  `;
}

// --- Eliminar: con confirmación obligatoria en la interfaz ---
export async function eliminarRegistro(id) {
  if (!puedeEditarAhora()) {
    throw new Error('Estás fuera de tu turno asignado y no puedes eliminar en este momento.');
  }
  try {
    await sql`DELETE FROM citas_medicas WHERE id = ${id};`;
    return { ok: true };
  } catch (error) {
    // 23503 = violación de llave foránea: la cita tiene pagos (aprobados o rechazados)
    if (error.code === '23503') {
      return { ok: false, mensaje: 'No se puede eliminar: tiene historial de pagos. Cambie su estado a "rechazado".' };
    }
    throw error;
  }
}

// Acepta Date (lo que devuelve el driver de Neon, medianoche local) o texto 'AAAA-MM-DD'.
// Devuelve 'AAAA-MM-DD' sin pasar por UTC, para no correr el día.
function formatearFecha(valor) {
  if (!valor) return '';
  if (typeof valor === 'string') return valor.slice(0, 10);
  if (isNaN(valor.getTime())) return '';
  return `${valor.getFullYear()}-${String(valor.getMonth() + 1).padStart(2, '0')}-${String(valor.getDate()).padStart(2, '0')}`;
}

(function () {
  if (!usuarioActual) return;

  const rolBanner = document.getElementById('rolBanner');
  if (usuarioActual.rol === 'empleado') {
    const enTurno = puedeEditarAhora();
    rolBanner.textContent = `Sesión: ${usuarioActual.nombre} · Rol: empleado · Turno asignado: ${usuarioActual.turno} ` +
      (enTurno ? '(dentro de turno, puedes editar)' : `(fuera de turno — ahora es turno ${turnoActual()}, solo puedes ver)`);
  } else {
    rolBanner.textContent = `Sesión: ${usuarioActual.nombre} · Rol: ${usuarioActual.rol} (acceso total, sin restricción de turno)`;
  }
  rolBanner.setAttribute('data-rol', usuarioActual.rol);

  // Solo el administrador ve el acceso a Caja
  if (usuarioActual.rol === 'administrador') document.querySelector('.nav-link-caja').style.display = '';

  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  btnCerrarSesion.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarSesion();
  });

  const crearForm = document.getElementById('crearForm');
  const tabla = document.getElementById('tablaPanel');
  const cuerpo = document.getElementById('cuerpoPanel');
  const vacio = document.getElementById('panelVacio');
  const cargando = document.getElementById('cargando'); // esqueleto shimmer
  const confirmBox = document.getElementById('confirmBox');
  const confirmTexto = document.getElementById('confirmTexto');

  function mostrarConfirmacion(texto) {
    confirmTexto.textContent = texto;
    confirmBox.hidden = false;
    void confirmBox.offsetWidth;
    confirmBox.classList.remove('show');
    void confirmBox.offsetWidth;
    confirmBox.classList.add('show');
    confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ---- Filas armadas con createElement + textContent: los datos de la base nunca se
  //      interpretan como HTML (práctica 8 del laboratorio) ----
  function celda(tr, texto = '') {
    const td = document.createElement('td');
    td.textContent = texto ?? '';
    tr.append(td);
    return td;
  }

  function insignia(clase, atributo, valor, texto) {
    const span = document.createElement('span');
    span.className = clase;
    span.dataset[atributo] = valor;
    span.textContent = texto;
    return span;
  }

  function textoPago(r) {
    if (r.estado_pago !== 'pagado') return r.estado_pago;
    return 'pagado' + (r.canal_pago ? ' · ' + (r.canal_pago === 'pasarela' ? 'en línea' : 'caja') : '');
  }

  function boton(texto, clase, accion) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = clase;
    b.dataset.accion = accion;
    b.textContent = texto;
    return b;
  }

  function botonApagado(texto, clase) {
    const s = document.createElement('span');
    s.className = clase;
    s.setAttribute('aria-disabled', 'true');
    s.title = 'Fuera de tu turno';
    s.textContent = texto;
    return s;
  }

  function filaVista(r) {
    const tr = document.createElement('tr');
    tr.dataset.id = r.id;
    const habilitado = puedeEditarAhora();

    celda(tr, r.codigo_seguimiento);
    celda(tr, r.nombre_paciente);
    celda(tr, r.dni);
    celda(tr, NOMBRES_ESPECIALIDAD[r.especialidad] || r.especialidad);
    celda(tr, formatearFecha(r.fecha_preferida));
    celda(tr).append(insignia('estado-badge', 'estado', r.estado, r.estado));
    celda(tr, formatearSoles(Number(r.monto_calculado)));
    celda(tr).append(insignia('pago-badge', 'pago', r.estado_pago, textoPago(r)));

    const acciones = celda(tr);
    acciones.className = 'acciones-fila';
    acciones.append(
      habilitado ? boton('Editar', 'btn-editar-fila', 'editar') : botonApagado('Editar', 'btn-editar-fila'),
      habilitado ? boton('Eliminar', 'btn-eliminar-fila', 'eliminar') : botonApagado('Eliminar', 'btn-eliminar-fila')
    );
    return tr;
  }

  function campoTexto(nombre, valor, propiedades) {
    const input = document.createElement('input');
    input.type = nombre === 'fecha_preferida' ? 'date' : 'text';
    input.dataset.campo = nombre;
    input.value = valor ?? '';
    Object.assign(input, propiedades);
    return input;
  }

  function campoSelect(nombre, opciones, actual) {
    const select = document.createElement('select');
    select.dataset.campo = nombre;
    for (const [valor, texto] of opciones) {
      const opcion = document.createElement('option');
      opcion.value = valor;
      opcion.textContent = texto;
      opcion.selected = valor === actual;
      select.append(opcion);
    }
    return select;
  }

  function filaEdicion(r) {
    const tr = document.createElement('tr');
    tr.dataset.id = r.id;

    celda(tr, r.codigo_seguimiento);
    celda(tr).append(campoTexto('nombre_paciente', r.nombre_paciente, { minLength: 4, required: true }));
    celda(tr).append(campoTexto('dni', r.dni, { maxLength: 8, required: true, pattern: '[0-9]{8}' }));
    celda(tr).append(campoSelect('especialidad', Object.entries(NOMBRES_ESPECIALIDAD), r.especialidad));
    celda(tr).append(campoTexto('fecha_preferida', formatearFecha(r.fecha_preferida)));
    celda(tr).append(campoSelect('estado', ESTADOS.map((e) => [e, e]), r.estado));
    celda(tr, formatearSoles(Number(r.monto_calculado)));
    celda(tr).append(insignia('pago-badge', 'pago', r.estado_pago, textoPago(r)));

    const acciones = celda(tr);
    acciones.className = 'acciones-fila';
    acciones.append(
      boton('Guardar', 'btn-guardar-fila', 'guardar'),
      boton('Cancelar', 'btn-cancelar-fila', 'cancelar')
    );
    return tr;
  }

  let registrosCache = [];

  async function cargar() {
    try {
      registrosCache = await listarTodos();
      cargando.hidden = true;

      if (registrosCache.length === 0) {
        vacio.hidden = false;
        tabla.hidden = true;
        return;
      }

      vacio.hidden = true;
      tabla.hidden = false;
      cuerpo.replaceChildren();
      registrosCache.forEach(function (r) {
        cuerpo.appendChild(filaVista(r));
      });
    } catch (error) {
      cargando.hidden = true;
      console.error('Error al listar registros:', error);
      vacio.hidden = false;
      vacio.textContent = 'No se pudieron cargar los registros. Intenta de nuevo más tarde.';
      tabla.hidden = true;
    }
  }

  cuerpo.addEventListener('click', async function (event) {
    const btn = event.target.closest('button[data-accion]');
    if (!btn) return;

    const tr = btn.closest('tr');
    const id = tr.dataset.id;
    const accion = btn.dataset.accion;

    if (accion === 'editar') {
      const registro = registrosCache.find(function (r) { return String(r.id) === String(id); });
      tr.replaceWith(filaEdicion(registro));
      return;
    }

    if (accion === 'cancelar') {
      await cargar();
      return;
    }

    if (accion === 'guardar') {
      const datos = {
        nombre_paciente: tr.querySelector('[data-campo="nombre_paciente"]').value.trim(),
        dni: tr.querySelector('[data-campo="dni"]').value.trim(),
        especialidad: tr.querySelector('[data-campo="especialidad"]').value,
        fecha_preferida: tr.querySelector('[data-campo="fecha_preferida"]').value,
        estado: tr.querySelector('[data-campo="estado"]').value,
        tiene_sis: (registrosCache.find(function (r) { return String(r.id) === String(id); }) || {}).tiene_sis === true
      };
      try {
        await actualizarComoPanel(id, datos);
        mostrarConfirmacion('Registro actualizado correctamente.');
        await cargar();
      } catch (error) {
        console.error('Error al actualizar:', error);
        alert('No se pudo actualizar el registro.');
      }
      return;
    }

    if (accion === 'eliminar') {
      const confirmar = confirm('¿Eliminar este registro de forma permanente? Esta acción no se puede deshacer.');
      if (!confirmar) return;
      try {
        tr.classList.add('fila-saliendo'); // la fila se desliza y se desvanece
        await new Promise((r) => setTimeout(r, 350));
        const resultado = await eliminarRegistro(id);
        if (!resultado.ok) {
          tr.classList.remove('fila-saliendo');
          alert(resultado.mensaje);
          return;
        }
        mostrarConfirmacion('Registro eliminado.');
        await cargar();
      } catch (error) {
        tr.classList.remove('fila-saliendo');
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar el registro.');
      }
    }
  });

  crearForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!crearForm.checkValidity()) {
      crearForm.reportValidity();
      return;
    }

    const datos = {
      nombre: document.getElementById('pNombre').value.trim(),
      dni: document.getElementById('pDni').value.trim(),
      especialidad: document.getElementById('pEspecialidad').value,
      fecha_preferida: document.getElementById('pFecha').value,
      pago: document.getElementById('pSis').checked ? 'sis' : 'particular'
    };

    const submitBtn = crearForm.querySelector('button[type="submit"]');
    try {
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      const codigo = await crearRegistro(datos);
      mostrarConfirmacion('Cita registrada con el código ' + codigo + '.');
      crearForm.reset();
      await cargar();
    } catch (error) {
      console.error('Error al crear registro:', error);
      alert('No se pudo registrar la cita.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
    }
  });

  // Cotizador en vivo del formulario "Registrar cita"
  const salidaMonto = document.getElementById('pMonto');
  function actualizarCotizacion() {
    salidaMonto.textContent = formatearSoles(calcularMontoServicio({
      especialidad: document.getElementById('pEspecialidad').value,
      pago: document.getElementById('pSis').checked ? 'sis' : 'particular'
    }));
  }
  crearForm.addEventListener('input', actualizarCotizacion);
  crearForm.addEventListener('change', actualizarCotizacion);
  actualizarCotizacion();

  cargar();
})();