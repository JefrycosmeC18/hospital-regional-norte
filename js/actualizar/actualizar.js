// js/actualizar/actualizar.js
// Script propio de actualizar.html — RF-10.6: el paciente edita una cita propia mientras su
// estado siga en 'registrado' Y no esté pagada. Si cambia la especialidad o el SIS,
// el monto se recalcula (Semana 9).

import { sql } from '../config/neon-config.js';
import { exigirRol, cerrarSesion } from '../auth/auth.js';
import { calcularMontoServicio, datosDeTarifa, formatearSoles } from '../registro/tarifario.js';

const usuarioActual = exigirRol('cliente');
if (!usuarioActual) throw new Error('Acceso denegado');

export async function obtenerRegistro(id) {
  const filas = await sql`
    SELECT id, nombre_paciente, dni, especialidad, fecha_preferida, estado, estado_pago, tiene_sis
    FROM citas_medicas
    WHERE id = ${id} AND id_usuario = ${usuarioActual.id};
  `;
  return filas[0] || null;
}

// false: no existe, no es tuyo, ya no está "registrado" o ya fue pagado
export async function actualizarRegistro(id, datos) {
  const { tipo_consulta, tiene_sis } = datosDeTarifa(datos);
  const monto = calcularMontoServicio(datos);
  const filas = await sql`
    UPDATE citas_medicas
    SET nombre_paciente = ${datos.nombre},
        dni = ${datos.dni},
        especialidad = ${datos.especialidad},
        fecha_preferida = ${datos.fecha_preferida},
        tipo_consulta = ${tipo_consulta},
        tiene_sis = ${tiene_sis},
        monto_calculado = ${monto},
        estado_pago = ${monto === 0 ? 'exonerado' : 'pendiente'}
    WHERE id = ${id} AND id_usuario = ${usuarioActual.id}
      AND estado = 'registrado' AND estado_pago <> 'pagado'
    RETURNING id;
  `;
  return filas.length === 1;
}

(function () {
  document.getElementById('btnCerrarSesion')?.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarSesion();
  });

  const id = new URLSearchParams(window.location.search).get('id');
  const form = document.getElementById('actualizarForm');
  const avisoSoloLectura = document.getElementById('avisoSoloLectura');
  const avisoTexto = document.getElementById('avisoTexto');
  const confirmBox = document.getElementById('confirmBox');
  const salidaMonto = document.getElementById('monto-estimado');

  if (!id) {
    window.location.href = 'consulta.html';
    return;
  }

  const leerFormulario = () => Object.fromEntries(new FormData(form));

  function actualizarCotizacion() {
    const d = leerFormulario();
    salidaMonto.textContent = d.especialidad ? formatearSoles(calcularMontoServicio(d)) : formatearSoles(0);
  }
  form.addEventListener('input', actualizarCotizacion);
  form.addEventListener('change', actualizarCotizacion);

  (async function cargar() {
    const registro = await obtenerRegistro(id);

    if (!registro) {
      // No existe o no pertenece a este paciente.
      window.location.href = 'consulta.html';
      return;
    }

    document.getElementById('nombre').value = registro.nombre_paciente || '';
    document.getElementById('dni').value = registro.dni || '';
    document.getElementById('especialidad').value = registro.especialidad || '';
    if (registro.fecha_preferida) {
      const f = registro.fecha_preferida;   // Date local (driver de Neon) o texto 'AAAA-MM-DD'
      document.getElementById('fecha-preferida').value = typeof f === 'string'
        ? f.slice(0, 10)
        : `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;
    }
    form.querySelector(`input[name="pago"][value="${registro.tiene_sis ? 'sis' : 'particular'}"]`).checked = true;
    actualizarCotizacion();

    if (registro.estado_pago === 'pagado') {
      avisoTexto.textContent = 'Esta cita ya fue pagada, por eso no se puede editar.';
      avisoSoloLectura.hidden = false;
      form.setAttribute('data-solo-lectura', 'true');
    } else if (registro.estado !== 'registrado') {
      avisoTexto.textContent = 'Esta cita ya no está en estado "registrado", así que no se puede editar.';
      avisoSoloLectura.hidden = false;
      form.setAttribute('data-solo-lectura', 'true');
    }
  })();

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (form.getAttribute('data-solo-lectura') === 'true') return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const d = leerFormulario();

    try {
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.textContent = 'Guardando cambios...';

      const ok = await actualizarRegistro(id, {
        nombre: d.nombre.trim(),
        dni: d.dni.trim(),
        especialidad: d.especialidad,
        fecha_preferida: d.fecha_preferida,
        pago: d.pago
      });

      if (!ok) {
        alert('No se pudo actualizar: la cita ya no es editable (fue pagada o cambió de estado).');
        window.location.href = 'consulta.html';
        return;
      }

      confirmBox.hidden = false;
      void confirmBox.offsetWidth;
      confirmBox.classList.remove('show');
      void confirmBox.offsetWidth;
      confirmBox.classList.add('show');
      confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      console.error('Error al actualizar registro:', error);
      alert('No se pudieron guardar los cambios. Intenta de nuevo.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
      submitBtn.textContent = 'Guardar cambios';
    }
  });
})();