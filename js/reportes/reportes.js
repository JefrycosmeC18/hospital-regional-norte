import { sql } from '../config/neon-config.js';
import { exigirRol, cerrarSesion } from '../auth/auth.js';
import { formatearSoles } from '../registro/tarifario.js';

const usuario = exigirRol('administrador');
if (!usuario) throw new Error('Solo administradores');
const $ = id => document.getElementById(id);
const nombres = {
  'medicina-general':'Medicina General','pediatria':'Pediatría',
  'ginecologia':'Ginecología y Obstetricia','cardiologia':'Cardiología',
  'traumatologia':'Traumatología','cirugia-general':'Cirugía General',
  'medicina-interna':'Medicina Interna','odontologia':'Odontología',
  'oftalmologia':'Oftalmología','psicologia':'Psicología'
};
const estados = [
  ['registrado','Registradas','#E0762E'],
  ['atendido','Atendidas','#0F5D52'],
  ['cancelado','Canceladas','#C1272D'],
  ['rechazado','Rechazadas','#667C9D']
];
const desde=$('reporteDesde'), hasta=$('reporteHasta'), especialidad=$('reporteEspecialidad');
const estadoTexto=$('estadoReportes'), errorFiltro=$('errorFiltroReporte');
const contenido=$('reporteContenido'), exportar=$('exportarReporte');
let citas=[], filtradas=[], cargado=false;
for(const [clave,nombre] of Object.entries(nombres)) {
  const o=document.createElement('option');o.value=clave;o.textContent=nombre;especialidad.append(o);
}
$('btnCerrarSesion')?.addEventListener('click',e=>{e.preventDefault();cerrarSesion();});

// La consulta no trae datos identificables de pacientes: solo dimensiones y montos.
export async function consultarReportes() {
  return await sql`SELECT especialidad, fecha_preferida::text AS fecha_preferida, estado, estado_pago, monto_calculado FROM citas_medicas`;
}
const agrupar=(lista,campo)=>lista.reduce((m,r)=>{
  const clave=campo(r);m.set(clave,(m.get(clave)||0)+1);return m;
},new Map());
const suma=lista=>Math.round(lista.reduce((n,r)=>n+(Number(r.monto_calculado)||0),0)*100)/100;
function elemento(tag,clase,valor){
  const e=document.createElement(tag);if(clase)e.className=clase;
  if(valor!==undefined)e.textContent=String(valor);return e;
}
function sinDatos(nodo){
  nodo.replaceChildren(elemento('p','reportes-sin-datos','No hay solicitudes en el período seleccionado.'));
}
function graficarEspecialidades(lista){
  const destino=$('graficoEspecialidades');destino.replaceChildren();
  const grupos=[...agrupar(lista,r=>nombres[r.especialidad]||'Otra especialidad')].sort((a,b)=>b[1]-a[1]);
  if(!grupos.length){sinDatos(destino);return;}
  for(const [nombre,cantidad] of grupos){
    const item=elemento('div','reportes-barra-item');
    const meta=elemento('div','reportes-barra-meta');
    meta.append(elemento('span','',nombre),elemento('strong','',cantidad));
    const pista=elemento('div','reportes-barra-pista');pista.setAttribute('role','img');
    pista.setAttribute('aria-label',nombre+': '+cantidad+' solicitudes');
    const relleno=elemento('div','reportes-barra-relleno');
    relleno.style.width=(cantidad/grupos[0][1]*100)+'%';pista.append(relleno);
    item.append(meta,pista);destino.append(item);
  }
}
function graficarEstados(lista){
  const cuenta=agrupar(lista,r=>r.estado),total=lista.length;
  $('graficoEstadosTotal').textContent=total;
  const leyenda=$('leyendaEstados');leyenda.replaceChildren();
  let inicio=0;const secciones=[];
  for(const [clave,nombre,color] of estados){
    const n=cuenta.get(clave)||0,fin=inicio+(total?n/total*100:0);
    secciones.push(color+' '+inicio.toFixed(3)+'% '+fin.toFixed(3)+'%');inicio=fin;
    const li=elemento('li');
    const etiqueta=elemento('span','legend-label');
    const swatch=elemento('span','legend-swatch');swatch.style.backgroundColor=color;
    etiqueta.append(swatch,elemento('span','',nombre));
    li.append(etiqueta,elemento('strong','',n));leyenda.append(li);
  }
  const grafico=$('graficoEstados');
  grafico.style.background=total?'conic-gradient('+secciones.join(', ')+')':'#dce7e2';
  grafico.setAttribute('aria-label',total
    ? estados.map(([clave,nombre])=>nombre+': '+(cuenta.get(clave)||0)).join(', ')
    :'Sin citas');
}
function graficarMeses(lista){
  const destino=$('graficoMeses');destino.replaceChildren();
  const meses=[...agrupar(lista,r=>String(r.fecha_preferida||'').slice(0,7))]
    .filter(([mes])=>/^\d{4}-(0[1-9]|1[0-2])$/.test(mes))
    .sort((a,b)=>a[0].localeCompare(b[0]));
  if(!meses.length){sinDatos(destino);return;}
  const mayor=Math.max(...meses.map(([,n])=>n));
  for(const [mes,n] of meses){
    const fecha=new Date(Number(mes.slice(0,4)),Number(mes.slice(5,7))-1,15);
    const etiqueta=new Intl.DateTimeFormat('es-PE',{month:'short',year:'numeric'}).format(fecha);
    const columna=elemento('div','reportes-mes');
    columna.setAttribute('role','img');columna.setAttribute('aria-label',etiqueta+': '+n+' citas');
    const barra=elemento('span','reportes-mes-barra');
    barra.style.height=Math.max(3,n/mayor*140)+'px';
    columna.append(elemento('strong','',n),barra,elemento('small','',etiqueta));destino.append(columna);
  }
}
function dibujar(){
  const cuenta=agrupar(filtradas,r=>r.estado);
  $('reporteTotal').textContent=filtradas.length;
  $('reporteRegistradas').textContent=cuenta.get('registrado')||0;
  $('reporteAtendidas').textContent=cuenta.get('atendido')||0;
  $('reporteCanceladas').textContent=cuenta.get('cancelado')||0;
  $('reporteRechazadas').textContent='Solicitudes rechazadas: '+(cuenta.get('rechazado')||0);
  $('montoPagado').textContent=formatearSoles(suma(filtradas.filter(r=>r.estado_pago==='pagado')));
  $('montoPendiente').textContent=formatearSoles(suma(filtradas.filter(r=>r.estado_pago==='pendiente')));
  $('citasExoneradas').textContent=filtradas.filter(r=>r.estado_pago==='exonerado').length;
  graficarEspecialidades(filtradas);graficarEstados(filtradas);graficarMeses(filtradas);
}
function filtrar(){
  if(!cargado)return;
  const invalido=!!(desde.value&&hasta.value&&desde.value>hasta.value);
  errorFiltro.hidden=!invalido;
  if(invalido){contenido.hidden=true;exportar.disabled=true;estadoTexto.textContent='Corrige el rango de fechas.';return;}
  filtradas=citas.filter(r=>{
    const fecha=String(r.fecha_preferida||'').slice(0,10);
    return (!desde.value||fecha>=desde.value)&&(!hasta.value||fecha<=hasta.value)
      &&(!especialidad.value||r.especialidad===especialidad.value);
  });
  dibujar();contenido.hidden=false;exportar.disabled=false;
  estadoTexto.textContent='Mostrando '+filtradas.length+' de '+citas.length+' solicitudes consultadas en Neon.';
}
function descargarCSV(){
  if(!cargado||!errorFiltro.hidden)return;
  const cuenta=agrupar(filtradas,r=>r.estado);
  const porEspecialidad=agrupar(filtradas,r=>nombres[r.especialidad]||'Otra especialidad');
  const porMes=agrupar(filtradas,r=>String(r.fecha_preferida||'').slice(0,7));
  const filas=[
    ['Reporte','Hospital Regional del Norte'],
    ['Fechas','Fecha preferida de atención, no confirmación'],
    ['Desde',desde.value||'Todas'],['Hasta',hasta.value||'Todas'],
    ['Especialidad',nombres[especialidad.value]||'Todas'],[],
    ['Indicador','Cantidad'],['Total de citas',filtradas.length],
    ...estados.map(([c,n])=>[n,cuenta.get(c)||0]),[],
    ['Especialidad','Cantidad'],
    ...[...porEspecialidad].sort((a,b)=>b[1]-a[1]),[],
    ['Mes','Cantidad'],
    ...[...porMes].sort((a,b)=>a[0].localeCompare(b[0])),[],
    ['Resumen de pagos','Valor'],
    ['Monto de citas pagadas S/',suma(filtradas.filter(r=>r.estado_pago==='pagado')).toFixed(2)],
    ['Monto de citas pendientes S/',suma(filtradas.filter(r=>r.estado_pago==='pendiente')).toFixed(2)],
    ['Citas exoneradas',filtradas.filter(r=>r.estado_pago==='exonerado').length]
  ];
  const escapar=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  const contenidoCSV='\uFEFFsep=;\r\n'+filas.map(f=>f.map(escapar).join(';')).join('\r\n');
  const url=URL.createObjectURL(new Blob([contenidoCSV],{type:'text/csv;charset=utf-8'}));
  const enlace=document.createElement('a');enlace.href=url;
  enlace.download='reporte-hospital-'+new Date().toLocaleDateString('en-CA')+'.csv';
  document.body.append(enlace);enlace.click();enlace.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
desde.addEventListener('change',filtrar);
hasta.addEventListener('change',filtrar);
especialidad.addEventListener('change',filtrar);
$('limpiarReporte').addEventListener('click',()=>{
  desde.value='';hasta.value='';especialidad.value='';filtrar();
});
exportar.addEventListener('click',descargarCSV);
(async()=>{
  try{citas=await consultarReportes();cargado=true;filtrar();}
  catch(error){
    console.error('Error en reportes:',error);
    estadoTexto.textContent='No se pudieron cargar los reportes. Revisa la conexión e intenta de nuevo.';
    contenido.hidden=true;exportar.disabled=true;
  }
})();
