import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useReportes} from '../hooks/useReportes';
export default function ReportesPage() {
  const m=useReportes();
  return <Page name="reportes" title="Reportes administrativos — Hospital Regional del Norte">
<header className="site-header">
<div className="container">
<Link className="brand" to="/">
<svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
<circle cx="24" cy="24" r="22" fill="#0F5D52"></circle>
<path d="M24 12v24M12 24h24" stroke="#F2F5F1" strokeWidth="5" strokeLinecap="round"></path>
<circle cx="24" cy="24" r="22" fill="none" stroke="#E0762E" strokeWidth="2"></circle>
</svg>
<span className="brand-text">
<span className="name">Hospital Regional del Norte</span>
<span className="tagline">MINSA · Piura</span>
</span>
</Link>
<input type="checkbox" id="nav-toggle" className="nav-toggle" checked={m.menu} onChange={e=>m.setMenu(e.target.checked)} />
<label htmlFor="nav-toggle" className="nav-toggle-label" aria-label="Abrir menú de navegación">
<span></span><span></span><span></span>
</label>
<nav className="main-nav" aria-label="Navegación principal">
<ul>
<li><Link to="/">Inicio</Link></li>
<li><Link to="/panel">Panel</Link></li>
<li hidden={m.user?.rol!=="administrador"}><Link aria-current="page" to="/reportes">Reportes</Link></li>
<li className="nav-link-caja" hidden={!m.user || !["administrador","cajero"].includes(m.user.rol)}><Link to="/caja">Caja</Link></li>

</ul>
</nav>
<HeaderTools /></div>
</header>
<main><Feedback error={m.error} loading={false} />
<section className="section">
<div className="container">
<div className="reportes-hero">
<div>
<p className="reportes-eyebrow">GESTIÓN HOSPITALARIA</p>
<h1>Reportes administrativos</h1>
<p>Analiza las solicitudes y los pagos registrados. Los gráficos utilizan datos del sistema y respetan los filtros seleccionados.</p>
</div>
<Link className="btn btn-outline" to="/panel">Volver al Panel</Link>
</div>
<section className="reportes-filtros" aria-labelledby="reportes-filtros-titulo">
<div className="reportes-filtros-head">
<h2 id="reportes-filtros-titulo">Personaliza tu reporte</h2>
<p>Las fechas corresponden a la <strong>fecha preferida de atención</strong>, no a una cita confirmada.</p>
</div>
<div className="reportes-filtros-grid">
<div className="reportes-campo">
<label htmlFor="reporteDesde">Desde</label>
<input type="date" id="reporteDesde" {...m.props["reporteDesde"]} />
</div>
<div className="reportes-campo">
<label htmlFor="reporteHasta">Hasta</label>
<input type="date" id="reporteHasta" {...m.props["reporteHasta"]} />
</div>
<div className="reportes-campo">
<label htmlFor="reporteEspecialidad">Especialidad</label>
<select id="reporteEspecialidad" {...m.props["reporteEspecialidad"]}><Options all /></select>
</div>
<div className="reportes-acciones">
<button type="button" className="btn btn-outline" id="limpiarReporte" {...m.props["limpiarReporte"]}>Limpiar filtros</button>
<button type="button" className="btn btn-primary" id="exportarReporte" {...m.props["exportarReporte"]}>Exportar CSV</button>
</div>
</div>
<p className="reportes-error-filtro" id="errorFiltroReporte" role="alert" {...m.props["errorFiltroReporte"]}>La fecha inicial no puede ser posterior a la final.</p>
<p className="reportes-estado" id="estadoReportes" role="status">{m.content["estadoReportes"]}</p>
</section>
<div id="reporteContenido" {...m.props["reporteContenido"]}>
<section className="reportes-resumen" aria-labelledby="reportes-resumen-titulo">
<h2 id="reportes-resumen-titulo">Resumen de solicitudes</h2>
<div className="reportes-kpis">
<article className="reportes-kpi"><span>Total de citas</span><strong id="reporteTotal">{m.content["reporteTotal"]}</strong><small>Solicitudes registradas</small></article>
<article className="reportes-kpi" data-tipo="registrado"><span>Registradas</span><strong id="reporteRegistradas">{m.content["reporteRegistradas"]}</strong><small>Estado registrado</small></article>
<article className="reportes-kpi" data-tipo="atendido"><span>Atendidas</span><strong id="reporteAtendidas">{m.content["reporteAtendidas"]}</strong><small>Atención completada</small></article>
<article className="reportes-kpi" data-tipo="cancelado"><span>Canceladas</span><strong id="reporteCanceladas">{m.content["reporteCanceladas"]}</strong><small>No incluye rechazadas</small></article>
</div>
<p className="reportes-nota" id="reporteRechazadas">{m.content["reporteRechazadas"]}</p>
</section>
<div className="reportes-grid">
<section className="reportes-grafico" aria-labelledby="tituloEspecialidades">
<div className="reportes-grafico-head">
<div><h2 id="tituloEspecialidades">Citas por especialidad</h2><p>Distribución de solicitudes seleccionadas.</p></div>
</div>
<div id="graficoEspecialidades" className="reportes-barras" aria-label="Gráfico de citas por especialidad">{m.content["graficoEspecialidades"]}</div>
</section>
<section className="reportes-grafico" aria-labelledby="tituloEstados">
<div className="reportes-grafico-head">
<div><h2 id="tituloEstados">Estados de las citas</h2><p>Comparación de registradas, atendidas, canceladas y rechazadas.</p></div>
</div>
<div className="reportes-dona-layout">
<div id="graficoEstados" className="reportes-dona" role="img" aria-label="Distribución de estados" {...m.props["graficoEstados"]}>
<span><strong id="graficoEstadosTotal">{m.content["graficoEstadosTotal"]}</strong><small>solicitudes</small></span>
</div>
<ul id="leyendaEstados" className="reportes-leyenda">{m.content["leyendaEstados"]}</ul>
</div>
</section>
</div>
<section className="reportes-grafico reportes-evolucion" aria-labelledby="tituloEvolucion">
<div className="reportes-grafico-head"><div>
<h2 id="tituloEvolucion">Evolución mensual</h2>
<p>Cantidad de solicitudes por mes de fecha preferida.</p>
</div></div>
<div id="graficoMeses" className="reportes-meses" aria-label="Evolución mensual de citas">{m.content["graficoMeses"]}</div>
</section>
<section className="reportes-grafico reportes-economia" aria-labelledby="tituloEconomia">
<div className="reportes-grafico-head"><div>
<h2 id="tituloEconomia">Resumen de pagos</h2>
<p>Importes de citas según su estado de pago, sin contar montos pendientes como cobrados.</p>
</div></div>
<div className="reportes-economia-grid">
<div><span>Monto de citas pagadas</span><strong id="montoPagado">{m.content["montoPagado"]}</strong><small>Estado de pago: pagado</small></div>
<div><span>Monto de citas pendientes</span><strong id="montoPendiente">{m.content["montoPendiente"]}</strong><small>No son ingresos cobrados</small></div>
<div><span>Citas exoneradas (SIS)</span><strong id="citasExoneradas">{m.content["citasExoneradas"]}</strong><small>Estado de pago: exonerado</small></div>
</div>
<p className="reportes-nota">Los importes son montos registrados por cita; este resumen no sustituye una conciliación de transacciones bancarias.</p>
</section>
</div>
</div>
</section>
</main>
<footer className="site-footer">
<div className="container"><p>Hospital Regional del Norte · Reportes de gestión de citas</p></div>
</footer>



</Page>;
}
