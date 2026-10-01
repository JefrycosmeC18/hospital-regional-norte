// js/registro/registro.js
// Script propio de registro.html: guarda la solicitud de cita del
// paciente en sesión en la tabla citas_medicas (RF-10.4), ahora con
// id_usuario (Semana 7) para que luego pueda consultarla y editarla.

import { sql } from '../config/neon-config.js';
import { verificarSesionProtegida, cerrarSesion } from '../auth/auth.js';

// RF-10.3: sin sesión activa, no se puede acceder al formulario.
const usuarioActual = verificarSesionProtegida();

export async function guardarRegistro(datos) {
  const codigo = 'COD-' + Date.now().toString().slice(-8);

  await sql`
    INSERT INTO citas_medicas (
      id_usuario,
      codigo_seguimiento,
      nombre_paciente,
      dni,
      especialidad,
      fecha_preferida
    ) VALUES (
      ${usuarioActual.id},
      ${codigo},
      ${datos.nombre},
      ${datos.dni},
      ${datos.especialidad},
      ${datos.fecha_preferida}
    );
  `;

  return codigo;
}

(function () {
  if (usuarioActual) {
    const lblBienvenida = document.getElementById('usuarioBienvenida');
    if (lblBienvenida) {
      lblBienvenida.textContent = `Paciente autenticado: ${usuarioActual.nombre} (${usuarioActual.correo})`;
    }
  }

  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  }

  var form = document.getElementById('citaForm');
  if (!form) return;

  var confirmBox = document.getElementById('confirmBox');
  var confirmTexto = document.getElementById('confirmTexto');
  var STORAGE_KEY = 'hrn_solicitudes_citas';

  var lista = document.getElementById('misSolicitudesLista');
  var vacioMsg = document.getElementById('misSolicitudesVacio');
  var borrarBtn = document.getElementById('borrarSolicitudes');
  var submitBtn = form.querySelector('button[type="submit"]');

  // --- Restricción de fechas ---
  var hoy = new Date().toISOString().split('T')[0];
  var fechaPreferidaInput = document.getElementById('fecha-preferida');
  var fechaNacimientoInput = document.getElementById('fecha-nacimiento');

  if (fechaPreferidaInput) fechaPreferidaInput.setAttribute('min', hoy);
  if (fechaNacimientoInput) fechaNacimientoInput.setAttribute('max', hoy);

  var NOMBRES_ESPECIALIDAD = {
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

  function leerSolicitudes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function guardarSolicitudLocal(solicitud) {
    var solicitudes = leerSolicitudes();
    solicitudes.unshift(solicitud);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudes));
  }

  function formatearFecha(valor) {
    if (!valor) return 'Sin especificar';
    var partes = valor.split('-');
    if (partes.length !== 3) return valor;
    return partes[2] + '/' + partes[1] + '/' + partes[0];
  }

  function pintarSolicitudes() {
    var solicitudes = leerSolicitudes();
    lista.innerHTML = '';

    if (solicitudes.length === 0) {
      vacioMsg.hidden = false;
      borrarBtn.hidden = true;
      return;
    }

    vacioMsg.hidden = true;
    borrarBtn.hidden = false;

    solicitudes.forEach(function (s) {
      var li = document.createElement('li');
      li.className = 'my-requests-item';
      li.innerHTML =
        '<span class="my-requests-name">' + s.nombre + '</span>' +
        '<span class="my-requests-detail">' + s.especialidad + ' · preferencia: ' + s.fecha + (s.codigo ? ' · Código: <strong>' + s.codigo + '</strong>' : '') + '</span>' +
        '<span class="my-requests-status">REGISTRADA EN NEON DB</span>';
      lista.appendChild(li);
    });
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (fechaPreferidaInput.value && fechaPreferidaInput.value < hoy) {
      alert('No puedes seleccionar una fecha pasada. Por favor, elige una fecha a partir de hoy.');
      fechaPreferidaInput.focus();
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var datosForm = new FormData(form);

    var datos = {
      nombre: (datosForm.get('nombre') || '').toString().trim(),
      dni: (datosForm.get('dni') || '').toString().trim(),
      especialidad: (datosForm.get('especialidad') || '').toString(),
      fecha_preferida: datosForm.get('fecha_preferida')
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Guardando cita en la base de datos...';

      var codigoGenerado = await guardarRegistro(datos);

      confirmTexto.innerHTML = '¡Listo! Registramos tu solicitud de cita en el sistema. Tu código de seguimiento es: <strong>' + codigoGenerado + '</strong>. Te confirmaremos la fecha y hora dentro de 24 horas hábiles.';

      guardarSolicitudLocal({
        codigo: codigoGenerado,
        nombre: datos.nombre,
        especialidad: NOMBRES_ESPECIALIDAD[datos.especialidad] || 'Especialidad no indicada',
        fecha: formatearFecha(datos.fecha_preferida)
      });

      pintarSolicitudes();

      confirmBox.hidden = false;
      void confirmBox.offsetWidth;
      confirmBox.classList.remove('show');
      void confirmBox.offsetWidth;
      confirmBox.classList.add('show');
      confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

      form.reset();

    } catch (error) {
      console.error('Error al guardar en Neon DB:', error);
      alert('Ocurrió un error al registrar la cita en la base de datos.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar solicitud de cita';
    }
  });

  borrarBtn.addEventListener('click', function () {
    localStorage.removeItem(STORAGE_KEY);
    pintarSolicitudes();
  });

  pintarSolicitudes();
})();
