// js/comprobante/comprobante.js — script propio de comprobante.html
// Constancia de pago imprimible. Un cliente solo puede ver sus propios comprobantes.

import { sql } from '../config/neon-config.js';
import { verificarSesionProtegida, cerrarSesion, rutaInicioSegunRol } from '../auth/auth.js';
import { formatearSoles } from '../registro/tarifario.js';

const usuario = verificarSesionProtegida();
if (!usuario) throw new Error('Sin sesión');

document.querySelector('#btnCerrarSesion')?.addEventListener('click', (e) => {
  e.preventDefault();
  cerrarSesion();
});

// El enlace "Volver" depende del rol: el paciente vuelve a sus citas, el resto a su módulo
document.querySelector('#volver').href =
  usuario.rol === 'cliente' ? 'consulta.html' : rutaInicioSegunRol(usuario.rol);

const NOMBRES_METODO = {
  tarjeta_debito: 'Tarjeta de débito', tarjeta_credito: 'Tarjeta de crédito',
  billetera: 'Billetera electrónica', efectivo: 'Efectivo', pos: 'Tarjeta en POS'
};

const contenedor = document.querySelector('#comprobante');
const op = new URLSearchParams(location.search).get('op');

const filas = await sql`
  SELECT p.codigo_operacion, p.canal, p.metodo, p.proveedor_billetera, p.marca_tarjeta, p.referencia,
         p.monto, p.monto_recibido, p.vuelto, p.fecha_pago, p.id_usuario,
         r.codigo_seguimiento, u.nombre AS cliente, c.nombre AS cajero
  FROM pagos p
  JOIN citas_medicas r ON r.id = p.id_registro
  LEFT JOIN usuarios u ON u.id = p.id_usuario
  LEFT JOIN usuarios c ON c.id = p.id_cajero
  WHERE p.codigo_operacion = ${op} AND p.estado = 'aprobado';
`;
const pago = filas[0];

function agregarDato(lista, etiqueta, valor) {
  const dt = document.createElement('dt');
  const dd = document.createElement('dd');
  dt.textContent = etiqueta;
  dd.textContent = valor ?? '—';          // textContent: nunca interpretar datos como HTML
  lista.append(dt, dd);
}

if (!pago || (usuario.rol === 'cliente' && pago.id_usuario !== usuario.id)) {
  contenedor.textContent = 'Comprobante no encontrado.';
} else {
  const dl = document.createElement('dl');
  agregarDato(dl, 'N.° de operación', pago.codigo_operacion);
  agregarDato(dl, 'Cita (código de seguimiento)', pago.codigo_seguimiento);
  agregarDato(dl, 'Paciente', pago.cliente ?? 'Atención presencial');
  agregarDato(dl, 'Canal', pago.canal === 'pasarela' ? 'Pago en línea' : 'Ventanilla');
  agregarDato(dl, 'Medio', `${NOMBRES_METODO[pago.metodo]} ${pago.marca_tarjeta ?? pago.proveedor_billetera ?? ''} ${pago.referencia ?? ''}`.trim());
  agregarDato(dl, 'Importe', formatearSoles(Number(pago.monto)));
  if (pago.metodo === 'efectivo') {
    agregarDato(dl, 'Recibido', formatearSoles(Number(pago.monto_recibido)));
    agregarDato(dl, 'Vuelto', formatearSoles(Number(pago.vuelto)));
  }
  if (pago.cajero) agregarDato(dl, 'Atendido por', pago.cajero);
  agregarDato(dl, 'Fecha y hora', new Date(pago.fecha_pago).toLocaleString('es-PE', { timeZone: 'America/Lima' }));
  contenedor.append(dl);
}

document.querySelector('#imprimir').addEventListener('click', () => window.print());