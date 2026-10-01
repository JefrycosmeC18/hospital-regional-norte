// js/consulta/consulta.js
// Script propio de consulta.html — RF-10.5: lista, mediante
// SELECT ... WHERE id_usuario = usuario.id, únicamente los registros
// de citas_medicas creados por el paciente en sesión.

import { sql } from '../config/neon-config.js';
import { verificarSesionProtegida, cerrarSesion } from '../auth/auth.js';

const usuarioActual = verificarSesionProtegida();

export async function listarMisRegistros(idUsuario) {
  return await sql`
    SELECT id, codigo_seguimiento, especialidad, fecha_preferida, estado, fecha_registro
    FROM citas_medicas
    WHERE id_usuario = ${idUsuario}
    ORDER BY fecha_registro DESC;
  `;
}

function formatearFecha(valor) {
  if (!valor) return 'Sin especificar';
  var d = new Date(valor);
  if (isNaN(d.getTime())) return valor;
  return d.toLocaleDateString('es-PE');
}

(function () {
  if (!usuarioActual) return;

  const lblBienvenida = document.getElementById('usuarioBienvenida');
  if (lblBienvenida) {
    lblBienvenida.textContent = `Paciente autenticado: ${usuarioActual.nombre} (${usuarioActual.correo})`;
  }

  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  }

  const tabla = document.getElementById('tablaRegistros');
  const cuerpo = document.getElementById('cuerpoRegistros');
  const vacio = document.getElementById('registrosVacio');

  (async function cargar() {
    try {
      const registros = await listarMisRegistros(usuarioActual.id);

      if (registros.length === 0) {
        vacio.hidden = false;
        tabla.hidden = true;
        return;
      }

      vacio.hidden = true;
      tabla.hidden = false;
      cuerpo.innerHTML = '';

      registros.forEach(function (r) {
        const editable = r.estado === 'registrado';
        const tr = document.createElement('tr');
        tr.innerHTML =
          '<td>' + r.codigo_seguimiento + '</td>' +
          '<td>' + r.especialidad + '</td>' +
          '<td>' + formatearFecha(r.fecha_preferida) + '</td>' +
          '<td><span class="estado-badge" data-estado="' + r.estado + '">' + r.estado + '</span></td>' +
          '<td>' + formatearFecha(r.fecha_registro) + '</td>' +
          '<td>' + (editable
            ? '<a class="btn-editar-fila" href="actualizar.html?id=' + r.id + '">Editar</a>'
            : '<span class="btn-editar-fila" aria-disabled="true">Editar</span>') +
          '</td>';
        cuerpo.appendChild(tr);
      });
    } catch (error) {
      console.error('Error al consultar registros:', error);
      vacio.hidden = false;
      vacio.textContent = 'No se pudieron cargar tus citas en este momento. Intenta de nuevo más tarde.';
      tabla.hidden = true;
    }
  })();
})();
