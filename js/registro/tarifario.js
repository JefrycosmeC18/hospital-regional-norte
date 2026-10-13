// js/registro/tarifario.js
// Regla de negocio del caso 10 (Hospital Regional del Norte):
//   Medicina General  -> S/ 15.00
//   Otra especialidad -> S/ 30.00
//   Con SIS           -> S/ 0.00 (exonerado)
//
// Es una función PURA: recibe datos y devuelve un número. No toca el DOM
// ni la base de datos, por eso se puede probar sola desde la consola.

export function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

export function formatearSoles(monto) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(monto);
}

// Utilidad: un checkbox marcado llega en FormData como 'on'
export const marcado = (valor) => valor === 'on';

// Deriva los datos de tarifa a partir de lo que ya tiene tu formulario:
//  - tipo_consulta: sale de la especialidad elegida
//  - tiene_sis: sale de la opción "Forma de pago = SIS" (o de un booleano de la BD)
export function datosDeTarifa(d) {
  const tipo_consulta = d.especialidad === 'medicina-general' ? 'general' : 'especialidad';
  const tiene_sis = d.tiene_sis === true || d.pago === 'sis' || marcado(d.tiene_sis);
  return { tipo_consulta, tiene_sis };
}

export function calcularMontoServicio(d) {
  if (!d.especialidad) return 0;                 // aún no eligió especialidad
  const { tipo_consulta, tiene_sis } = datosDeTarifa(d);
  if (tiene_sis) return 0;                       // exonerado
  return redondear(tipo_consulta === 'especialidad' ? 30.00 : 15.00);
}