// js/registro/registro.js — versión Semana 9
// Script propio de registro.html: cotizador en vivo + INSERT con monto (RF-10.09).
// Si la cita tiene costo, el paciente pasa a la pasarela (pago.html); con SIS queda exonerada.

import { sql } from '../config/neon-config.js';
import { exigirRol, cerrarSesion } from '../auth/auth.js';
import { calcularMontoServicio, datosDeTarifa, formatearSoles } from './tarifario.js';

// RF-10.3: solo el paciente (cliente) con sesión activa entra a este formulario.
const usuarioActual = exigirRol('cliente');
if (!usuarioActual) throw new Error('Acceso denegado');

// RF-10.4 + RF-10.09: guarda la cita con su monto. El monto se RECALCULA aquí,
// no se confía en lo que muestra la pantalla.
export async function guardarRegistro(datos) {
  const codigo = 'COD-' + Date.now().toString().slice(-8);
  const { tipo_consulta, tiene_sis } = datosDeTarifa(datos);
  const monto = calcularMontoServicio(datos);
  const estadoPago = monto === 0 ? 'exonerado' : 'pendiente';

  const filas = await sql`
    INSERT INTO citas_medicas (
      id_usuario, codigo_seguimiento, nombre_paciente, dni, especialidad, fecha_preferida,
      tipo_consulta, tiene_sis, monto_calculado, estado_pago, estado
    ) VALUES (
      ${usuarioActual.id}, ${codigo}, ${datos.nombre}, ${datos.dni}, ${datos.especialidad}, ${datos.fecha_preferida},
      ${tipo_consulta}, ${tiene_sis}, ${monto}, ${estadoPago}, 'registrado'
    )
    RETURNING id;
  `;
  return { id: filas[0].id, codigo, monto, estadoPago };
}

(function () {
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

  const form = document.getElementById('citaForm');
  if (!form) return;

  const confirmBox = document.getElementById('confirmBox');
  const confirmTexto = document.getElementById('confirmTexto');
  const salidaMonto = document.getElementById('monto-estimado');
  const notaMonto = document.getElementById('monto-nota');
  const STORAGE_KEY = 'hrn_solicitudes_citas';

  const lista = document.getElementById('misSolicitudesLista');
  const vacioMsg = document.getElementById('misSolicitudesVacio');
  const borrarBtn = document.getElementById('borrarSolicitudes');
  const submitBtn = form.querySelector('button[type="submit"]');

  // --- Restricción de fechas ---
  // Fecha de HOY en Lima (AAAA-MM-DD). Con toISOString() saldría la fecha UTC y, a partir de las
  // 7:00 p.m. de Lima, ya sería "mañana": el paciente no podría elegir el día de hoy.
  const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
  const fechaPreferidaInput = document.getElementById('fecha-preferida');
  const fechaNacimientoInput = document.getElementById('fecha-nacimiento');
  if (fechaPreferidaInput) fechaPreferidaInput.setAttribute('min', hoy);
  if (fechaNacimientoInput) fechaNacimientoInput.setAttribute('max', hoy);

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

  // --- Cotizador en vivo (RF-10.09) ---
  const leerFormulario = () => Object.fromEntries(new FormData(form));

  function actualizarCotizacion() {
    const d = leerFormulario();
    const monto = calcularMontoServicio(d);
    salidaMonto.textContent = formatearSoles(monto);
    if (!d.especialidad) notaMonto.textContent = 'Elige una especialidad para ver el precio de tu ticket.';
    else if (monto === 0) notaMonto.textContent = 'Con SIS tu consulta está exonerada: no necesitas pagar.';
    else notaMonto.textContent = 'Ticket: Medicina General S/ 15.00 · Especialidad S/ 30.00.';
  }
  form.addEventListener('input', actualizarCotizacion);   // texto, en cada tecla
  form.addEventListener('change', actualizarCotizacion);  // select, radio
  actualizarCotizacion();

  // --- Historial local (complemento visual) ---
  function leerSolicitudes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
  }
  function guardarSolicitudLocal(solicitud) {
    const solicitudes = leerSolicitudes();
    solicitudes.unshift(solicitud);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudes));
  }
  function formatearFecha(valor) {
    if (!valor) return 'Sin especificar';
    const partes = valor.split('-');
    if (partes.length !== 3) return valor;
    return partes[2] + '/' + partes[1] + '/' + partes[0];
  }
  function pintarSolicitudes() {
    const solicitudes = leerSolicitudes();
    lista.replaceChildren();
    if (solicitudes.length === 0) {
      vacioMsg.hidden = false;
      borrarBtn.hidden = true;
      return;
    }
    vacioMsg.hidden = true;
    borrarBtn.hidden = false;
    solicitudes.forEach(function (s) {
      const li = document.createElement('li');
      li.className = 'my-requests-item';

      const nombre = document.createElement('span');
      nombre.className = 'my-requests-name';
      nombre.textContent = s.nombre;

      const detalle = document.createElement('span');
      detalle.className = 'my-requests-detail';
      detalle.append(`${s.especialidad} · preferencia: ${s.fecha}`);
      if (s.codigo) {
        const fuerte = document.createElement('strong');
        fuerte.textContent = s.codigo;
        detalle.append(' · Código: ', fuerte);
      }
      if (s.monto) detalle.append(` · ${s.monto}`);

      const estado = document.createElement('span');
      estado.className = 'my-requests-status';
      estado.textContent = 'REGISTRADA EN NEON DB';

      li.append(nombre, detalle, estado);
      lista.append(li);
    });
  }

  // Mensaje de confirmación con DOM (sin innerHTML): código, monto y enlace a la pasarela
  function mostrarConfirmacion({ codigo, monto, estadoPago, idRegistro }) {
    confirmTexto.textContent = '';
    confirmTexto.append('¡Listo! Registramos tu cita. Tu código de seguimiento es ');
    const fuerte = document.createElement('strong');
    fuerte.textContent = codigo;
    confirmTexto.append(fuerte, '. ');

    const enlace = document.createElement('a');
    if (estadoPago === 'pendiente') {
      confirmTexto.append(`El ticket cuesta ${formatearSoles(monto)}. Te llevamos a la pasarela de pago… `);
      enlace.href = `pago.html?id=${idRegistro}`;
      enlace.textContent = 'Pagar ahora';
    } else {
      confirmTexto.append('Tu consulta está exonerada de pago (SIS). ');
      enlace.href = 'consulta.html';
      enlace.textContent = 'Ver mis citas';
    }
    confirmTexto.append(enlace);

    confirmBox.hidden = false;
    void confirmBox.offsetWidth;
    confirmBox.classList.remove('show');
    void confirmBox.offsetWidth;
    confirmBox.classList.add('show');
    confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Se deja ver el código y la animación antes de pasar a la siguiente pantalla
    setTimeout(() => { window.location.href = enlace.href; }, 3500);
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

    const datos = {
      nombre: (leerFormulario().nombre || '').toString().trim(),
      dni: (leerFormulario().dni || '').toString().trim(),
      especialidad: (leerFormulario().especialidad || '').toString(),
      fecha_preferida: leerFormulario().fecha_preferida,
      pago: leerFormulario().pago           // 'sis' | 'particular' → define tiene_sis
    };

    try {
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.textContent = 'Guardando cita en la base de datos...';

      const r = await guardarRegistro(datos);

      guardarSolicitudLocal({
        codigo: r.codigo,
        nombre: datos.nombre,
        especialidad: NOMBRES_ESPECIALIDAD[datos.especialidad] || 'Especialidad no indicada',
        fecha: formatearFecha(datos.fecha_preferida),
        monto: r.estadoPago === 'exonerado' ? 'Exonerado' : formatearSoles(r.monto)
      });
      pintarSolicitudes();
      mostrarConfirmacion({ codigo: r.codigo, monto: r.monto, estadoPago: r.estadoPago, idRegistro: r.id });
      form.reset();
      actualizarCotizacion();
    } catch (error) {
      console.error('Error al guardar en Neon DB:', error);
      alert('Ocurrió un error al registrar la cita en la base de datos.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
      submitBtn.textContent = 'Enviar solicitud de cita';
    }
  });

  borrarBtn.addEventListener('click', function () {
    localStorage.removeItem(STORAGE_KEY);
    pintarSolicitudes();
  });

  pintarSolicitudes();
})();