// js/actualizar/actualizar.js
// Script propio de actualizar.html — RF-10.6: el paciente edita un
// registro propio de citas_medicas mientras su estado siga en
// 'registrado'. El AND id_usuario = usuario.id evita que edite el
// registro de otro paciente, aunque cambie el id en la URL.

import { sql } from '../config/neon-config.js';
import { verificarSesionProtegida, cerrarSesion } from '../auth/auth.js';

const usuarioActual = verificarSesionProtegida();

export async function obtenerRegistro(id) {
  const filas = await sql`
    SELECT id, nombre_paciente, dni, especialidad, fecha_preferida, estado
    FROM citas_medicas
    WHERE id = ${id} AND id_usuario = ${usuarioActual.id};
  `;
  return filas[0] || null;
}

export async function actualizarRegistro(id, datos) {
  await sql`
    UPDATE citas_medicas
    SET nombre_paciente = ${datos.nombre},
        dni = ${datos.dni},
        especialidad = ${datos.especialidad},
        fecha_preferida = ${datos.fecha_preferida}
    WHERE id = ${id} AND id_usuario = ${usuarioActual.id};
  `;
}

(function () {
  if (!usuarioActual) return;

  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const form = document.getElementById('actualizarForm');
  const avisoSoloLectura = document.getElementById('avisoSoloLectura');
  const confirmBox = document.getElementById('confirmBox');
  const confirmTexto = document.getElementById('confirmTexto');

  if (!id) {
    window.location.href = 'consulta.html';
    return;
  }

  (async function cargar() {
    const registro = await obtenerRegistro(id);

    if (!registro) {
      // No existe o no pertenece a este paciente.
      window.location.href = 'consulta.html';
      return;
    }

    document.getElementById('regId').value = registro.id;
    document.getElementById('nombre').value = registro.nombre_paciente || '';
    document.getElementById('dni').value = registro.dni || '';
    document.getElementById('especialidad').value = registro.especialidad || '';
    if (registro.fecha_preferida) {
      document.getElementById('fecha-preferida').value =
        new Date(registro.fecha_preferida).toISOString().split('T')[0];
    }

    if (registro.estado !== 'registrado') {
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

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Guardando cambios...';

      await actualizarRegistro(id, {
        nombre: document.getElementById('nombre').value.trim(),
        dni: document.getElementById('dni').value.trim(),
        especialidad: document.getElementById('especialidad').value,
        fecha_preferida: document.getElementById('fecha-preferida').value
      });

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
      submitBtn.textContent = 'Guardar cambios';
    }
  });
})();
