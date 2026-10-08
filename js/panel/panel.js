// js/panel/panel.js
// Script propio de panel.html — RF-10.7 y RF-10.8: administrador y
// empleado comparten el mismo panel con las cuatro operaciones sobre
// TODOS los registros de citas_medicas (no solo los propios).

import { sql } from '../config/neon-config.js';
import { verificarPanelProtegido, cerrarSesion } from '../auth/auth.js';

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
    SELECT id, codigo_seguimiento, nombre_paciente, dni, especialidad, fecha_preferida, estado
    FROM citas_medicas
    ORDER BY fecha_registro DESC;
  `;
}

// --- Crear: el panel también registra citas sin cuenta de paciente ---
export async function crearRegistro(datos) {
  const codigo = 'COD-' + Date.now().toString().slice(-8);
  await sql`
    INSERT INTO citas_medicas (codigo_seguimiento, nombre_paciente, dni, especialidad, fecha_preferida, estado)
    VALUES (${codigo}, ${datos.nombre}, ${datos.dni}, ${datos.especialidad}, ${datos.fecha_preferida}, 'registrado');
  `;
  return codigo;
}

// --- Actualizar: cualquier registro, incluido el estado ---
export async function actualizarComoPanel(id, datos) {
  if (!puedeEditarAhora()) {
    throw new Error('Estás fuera de tu turno asignado y no puedes editar en este momento.');
  }
  await sql`
    UPDATE citas_medicas
    SET nombre_paciente = ${datos.nombre_paciente},
        dni = ${datos.dni},
        especialidad = ${datos.especialidad},
        fecha_preferida = ${datos.fecha_preferida},
        estado = ${datos.estado}
    WHERE id = ${id};
  `;
}

// --- Eliminar: con confirmación obligatoria en la interfaz ---
export async function eliminarRegistro(id) {
  if (!puedeEditarAhora()) {
    throw new Error('Estás fuera de tu turno asignado y no puedes eliminar en este momento.');
  }
  await sql`DELETE FROM citas_medicas WHERE id = ${id};`;
}

function formatearFecha(valor) {
  if (!valor) return '';
  var d = new Date(valor);
  if (isNaN(d.getTime())) return valor;
  return d.toISOString().split('T')[0];
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

  function filaVista(r) {
    const tr = document.createElement('tr');
    tr.dataset.id = r.id;
    const habilitado = puedeEditarAhora();
    tr.innerHTML =
      '<td>' + r.codigo_seguimiento + '</td>' +
      '<td>' + (r.nombre_paciente || '') + '</td>' +
      '<td>' + (r.dni || '') + '</td>' +
      '<td>' + (NOMBRES_ESPECIALIDAD[r.especialidad] || r.especialidad || '') + '</td>' +
      '<td>' + formatearFecha(r.fecha_preferida) + '</td>' +
      '<td><span class="estado-badge" data-estado="' + r.estado + '">' + r.estado + '</span></td>' +
      '<td class="acciones-fila">' +
        (habilitado
          ? '<button type="button" class="btn-editar-fila" data-accion="editar">Editar</button>'
          : '<span class="btn-editar-fila" aria-disabled="true" title="Fuera de tu turno">Editar</span>') +
        (habilitado
          ? '<button type="button" class="btn-eliminar-fila" data-accion="eliminar">Eliminar</button>'
          : '<span class="btn-eliminar-fila" aria-disabled="true" title="Fuera de tu turno">Eliminar</span>') +
      '</td>';
    return tr;
  }

  function filaEdicion(r) {
    const tr = document.createElement('tr');
    tr.dataset.id = r.id;

    const opcionesEspecialidad = Object.keys(NOMBRES_ESPECIALIDAD).map(function (clave) {
      const sel = clave === r.especialidad ? ' selected' : '';
      return '<option value="' + clave + '"' + sel + '>' + NOMBRES_ESPECIALIDAD[clave] + '</option>';
    }).join('');

    const opcionesEstado = ESTADOS.map(function (e) {
      const sel = e === r.estado ? ' selected' : '';
      return '<option value="' + e + '"' + sel + '>' + e + '</option>';
    }).join('');

    tr.innerHTML =
      '<td>' + r.codigo_seguimiento + '</td>' +
      '<td><input type="text" data-campo="nombre_paciente" value="' + (r.nombre_paciente || '') + '" minlength="4" required></td>' +
      '<td><input type="text" data-campo="dni" value="' + (r.dni || '') + '" pattern="[0-9]{8}" maxlength="8" required></td>' +
      '<td><select data-campo="especialidad">' + opcionesEspecialidad + '</select></td>' +
      '<td><input type="date" data-campo="fecha_preferida" value="' + formatearFecha(r.fecha_preferida) + '"></td>' +
      '<td><select data-campo="estado">' + opcionesEstado + '</select></td>' +
      '<td class="acciones-fila">' +
        '<button type="button" class="btn-guardar-fila" data-accion="guardar">Guardar</button>' +
        '<button type="button" class="btn-cancelar-fila" data-accion="cancelar">Cancelar</button>' +
      '</td>';
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
      cuerpo.innerHTML = '';
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
        estado: tr.querySelector('[data-campo="estado"]').value
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
        await eliminarRegistro(id);
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
      fecha_preferida: document.getElementById('pFecha').value
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

  cargar();
})();
