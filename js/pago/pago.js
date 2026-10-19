// js/pago/pago.js — script propio de pago.html (pasarela de pagos del paciente)

import { exigirRol, cerrarSesion } from '../auth/auth.js';
import { formatearSoles } from '../registro/tarifario.js';
import {
  soloDigitos, formatearNumeroTarjeta, formatearVencimiento, detectarMarca, validarFormularioTarjeta,
  validarCelular, validarCodigoAprobacion
} from './validaciones.js';
import { obtenerRegistro, listarPendientesCliente, pagarConTarjeta, pagarConBilletera } from './pasarela.js';

const usuario = exigirRol('cliente');
if (!usuario) throw new Error('Acceso denegado');

document.querySelector('#btnCerrarSesion')?.addEventListener('click', (e) => {
  e.preventDefault();
  cerrarSesion();
});

const selectRegistro = document.querySelector('#registro');
const resumenMonto = document.querySelector('#resumen-monto');
const mensaje = document.querySelector('#mensaje-pago');
const formTarjeta = document.querySelector('#form-tarjeta');
const formBilletera = document.querySelector('#form-billetera');
const inputNumero = document.querySelector('#numero');
const inputVenc = document.querySelector('#vencimiento');
const marcaDetectada = document.querySelector('#marca-detectada');
const bloquePago = document.querySelector('#bloque-pago');
const latCodigo = document.querySelector('#lat-codigo');
const latMedio = document.querySelector('#lat-medio');
const latTotal = document.querySelector('#lat-total');

let registroActual = null;

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje mensaje--${tipo}`;
}

function mostrarError(campo, texto = '') {
  document.querySelector(`#error-${campo}`).textContent = texto;
  document.querySelector(`#${campo}`).setAttribute('aria-invalid', texto ? 'true' : 'false');
}

// 1. Cargar las citas pendientes del paciente
async function cargarPendientes() {
  const pendientes = await listarPendientesCliente(usuario.id);
  selectRegistro.replaceChildren();

  if (pendientes.length === 0) {
    mostrarMensaje('No tienes citas pendientes de pago.', 'info');
    bloquePago.hidden = true;
    return;
  }

  for (const p of pendientes) {
    const opcion = document.createElement('option');
    opcion.value = p.id;
    opcion.textContent = `${p.codigo_seguimiento} — ${formatearSoles(Number(p.monto_calculado))}`;
    selectRegistro.append(opcion);
  }

  // Si llegó desde registro.html o consulta.html con ?id=, preseleccionarlo
  const idUrl = new URLSearchParams(location.search).get('id');
  if (idUrl && pendientes.some(p => String(p.id) === idUrl)) selectRegistro.value = idUrl;
  await seleccionarRegistro();
}

async function seleccionarRegistro() {
  registroActual = await obtenerRegistro(Number(selectRegistro.value), usuario.id);
  resumenMonto.textContent = registroActual ? formatearSoles(Number(registroActual.monto_calculado)) : '—';
  // El panel lateral repite el mismo ticket
  latTotal.textContent = resumenMonto.textContent;
  latCodigo.textContent = registroActual?.codigo_seguimiento ?? '—';
}

// 2. Alternar entre tarjeta y billetera
function mostrarMetodo() {
  const metodo = document.querySelector('input[name="metodo"]:checked').value;
  formTarjeta.hidden = metodo !== 'tarjeta';
  formBilletera.hidden = metodo !== 'billetera';
  tarjetaVisual.hidden = metodo !== 'tarjeta';          // la tarjeta solo acompaña al pago con tarjeta
  latMedio.textContent = metodo === 'tarjeta' ? 'Tarjeta de débito o crédito' : 'Billetera electrónica';
}

// 3. Formato en vivo + vista previa de la tarjeta (se actualiza con cada tecla)
const tarjetaVisual = document.querySelector('#tarjeta-visual');
const inputCvv = document.querySelector('#cvv');
const inputTitular = document.querySelector('#titular');

function refrescarTarjeta() {
  const numero = inputNumero.value;
  const marca = detectarMarca(numero);
  tarjetaVisual.dataset.marca = marca ?? '';                       // el CSS cambia el color según la marca
  if (!formTarjeta.hidden) latMedio.textContent = marca ? `Tarjeta ${marca}` : 'Tarjeta de débito o crédito';
  document.querySelector('#tv-marca').textContent = marca ?? '—';
  document.querySelector('#tv-numero').textContent =
    soloDigitos(numero) ? formatearNumeroTarjeta(numero) : '•••• •••• •••• ••••';
  document.querySelector('#tv-titular').textContent = inputTitular.value.trim().toUpperCase() || 'NOMBRE APELLIDO';
  document.querySelector('#tv-venc').textContent = inputVenc.value || 'MM/AA';
  document.querySelector('#tv-cvv').textContent = inputCvv.value
    ? '•'.repeat(inputCvv.value.length)
    : (marca === 'American Express' ? '••••' : '•••');             // Amex usa CVV de 4 dígitos
}

inputNumero.addEventListener('input', () => {
  inputNumero.value = formatearNumeroTarjeta(inputNumero.value);
  marcaDetectada.textContent = detectarMarca(inputNumero.value) ?? '';
  refrescarTarjeta();
});
inputVenc.addEventListener('input', () => {
  inputVenc.value = formatearVencimiento(inputVenc.value);
  refrescarTarjeta();
});
[inputCvv, inputTitular].forEach((campo) => campo.addEventListener('input', refrescarTarjeta));

// Al entrar al CVV la tarjeta gira (rotateY, solo CSS); al salir, vuelve
inputCvv.addEventListener('focus', () => tarjetaVisual.classList.add('volteada'));
inputCvv.addEventListener('blur', () => tarjetaVisual.classList.remove('volteada'));

// 4. Procesar un pago (común a tarjeta y billetera)
async function procesar(formulario, operacion) {
  if (!registroActual || registroActual.estado_pago !== 'pendiente') {
    mostrarMensaje('Selecciona una cita pendiente de pago.', 'error');
    return;
  }
  const boton = formulario.querySelector('button[type="submit"]');
  const textoOriginal = boton.textContent;
  boton.disabled = true;                       // evita el doble clic = doble cobro
  boton.classList.add('is-loading');
  boton.textContent = 'Procesando...';
  mostrarMensaje('Conectando con la entidad...', 'info');

  try {
    const resultado = await operacion();
    if (resultado.aprobado) {
      formulario.reset();
      if (formulario === formTarjeta) refrescarTarjeta();   // reset() no dispara 'input'
      mostrarMensaje(`Pago aprobado. Operación ${resultado.codigo}.`, 'exito');
      setTimeout(() => {
        window.location.href = `comprobante.html?op=${encodeURIComponent(resultado.codigo)}`;
      }, 1500);
    } else {
      mostrarMensaje(`Pago rechazado: ${resultado.motivo}`, 'error');
    }
  } catch (error) {
    console.error(error);
    mostrarMensaje('No se pudo procesar el pago. Revisa tu conexión.', 'error');
  } finally {
    boton.disabled = false;
    boton.classList.remove('is-loading');
    boton.textContent = textoOriginal;
  }
}

formTarjeta.addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(formTarjeta));
  const { valido, errores, marca, venc } = validarFormularioTarjeta(datos);
  ['numero', 'vencimiento', 'cvv', 'titular'].forEach(campo => mostrarError(campo, errores[campo]));
  if (!valido) return;

  await procesar(formTarjeta, () => pagarConTarjeta({
    registro: registroActual, usuario, numero: datos.numero,
    mes: venc.mes, anio: venc.anio, cvv: datos.cvv, marca
  }));
});

formBilletera.addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(formBilletera));
  const celularOk = validarCelular(datos.celular);
  const codigoOk = validarCodigoAprobacion(datos.codigo);
  mostrarError('celular', celularOk ? '' : 'Celular de 9 dígitos que empiece con 9.');
  mostrarError('codigo', codigoOk ? '' : 'El código tiene 6 dígitos.');
  if (!celularOk || !codigoOk) return;

  await procesar(formBilletera, () => pagarConBilletera({
    registro: registroActual, usuario, proveedor: datos.proveedor,
    celular: datos.celular, codigoAprobacion: datos.codigo
  }));
});

document.querySelectorAll('input[name="metodo"]').forEach(r => r.addEventListener('change', mostrarMetodo));
selectRegistro.addEventListener('change', seleccionarRegistro);

mostrarMetodo();
cargarPendientes();