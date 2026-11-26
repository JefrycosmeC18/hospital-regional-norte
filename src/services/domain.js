export const specialties = { 'medicina-general': 'Medicina General', pediatria: 'Pediatría', ginecologia: 'Ginecología y Obstetricia', cardiologia: 'Cardiología', traumatologia: 'Traumatología', 'cirugia-general': 'Cirugía General', 'medicina-interna': 'Medicina Interna', odontologia: 'Odontología', oftalmologia: 'Oftalmología', psicologia: 'Psicología' };
export const states = ['registrado', 'atendido', 'rechazado', 'cancelado'];
export const norm = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const date = v => String(v ?? '').slice(0, 10);
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export const editable = r => r?.estado === 'registrado' && r.estado_pago !== 'pagado';
export const payable = r => r?.estado_pago === 'pendiente' && !['rechazado', 'cancelado'].includes(r.estado);
export function canEdit(user) { const h = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'America/Lima' }).format(new Date())); return user?.rol === 'administrador' || (user?.rol === 'empleado' && user.turno === (h >= 6 && h < 14 ? 'mañana' : h >= 14 && h < 22 ? 'tarde' : 'noche-madrugada')); }
export const group = (rows, fn) => Object.entries(rows.reduce((a, r) => { const k = fn(r); a[k] = (a[k] || 0) + 1; return a; }, Object.create(null)));
export const sum = (rows, k = 'monto_calculado') => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0);
