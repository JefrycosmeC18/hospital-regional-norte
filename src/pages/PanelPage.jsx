import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {usePanel} from '../hooks/usePanel';
export default function PanelPage() {
  const m=usePanel();
  return <Page name="panel" title="Panel de gestión — Hospital Regional del Norte">
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
<li><Link aria-current="page" to="/panel">Panel</Link></li>
<li className="nav-link-reportes" hidden={m.user?.rol!=="administrador"}><Link to="/reportes">Reportes</Link></li>
<li className="nav-link-caja" hidden={!m.user || !["administrador","cajero"].includes(m.user.rol)}><Link to="/caja">Caja</Link></li>

</ul>
</nav>
<HeaderTools /></div>
</header>
<main><Feedback error={m.error} loading={false} />
<section className="section">
<div className="container">
<div className="section-head">
<h1>Panel de gestión de citas</h1>
<p>Crea, consulta, actualiza (incluido el estado) y elimina cualquier solicitud de cita del sistema.</p>
</div>
<div className="confirm-box" id="confirmBox" {...m.props["confirmBox"]}>
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
<circle cx="12" cy="12" r="11" fill="#0F5D52"></circle>
<path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
<p id="confirmTexto">{m.content["confirmTexto"]}</p>
</div>
<section className="dashboard-resumen" aria-labelledby="resumen-citas-titulo">
<div className="dashboard-resumen-head">
<div>
<h2 id="resumen-citas-titulo">Resumen de citas</h2>
<p>Información actualizada desde los registros del sistema.</p>
</div>
</div>
<div className="dashboard-kpis">
<article className="dashboard-kpi">
<span className="dashboard-kpi-label">Total de citas</span>
<strong className="dashboard-kpi-valor" id="kpiTotal">{m.content["kpiTotal"]}</strong>
<span className="dashboard-kpi-detalle">Todas las solicitudes</span>
</article>
<article className="dashboard-kpi" data-estado="registrado">
<span className="dashboard-kpi-label">Registradas</span>
<strong className="dashboard-kpi-valor" id="kpiRegistradas">{m.content["kpiRegistradas"]}</strong>
<span className="dashboard-kpi-detalle">Pendientes de atención</span>
</article>
<article className="dashboard-kpi" data-estado="atendido">
<span className="dashboard-kpi-label">Atendidas</span>
<strong className="dashboard-kpi-valor" id="kpiAtendidas">{m.content["kpiAtendidas"]}</strong>
<span className="dashboard-kpi-detalle">Atención completada</span>
</article>
<article className="dashboard-kpi" data-estado="cancelado">
<span className="dashboard-kpi-label">Canceladas</span>
<strong className="dashboard-kpi-valor" id="kpiCanceladas">{m.content["kpiCanceladas"]}</strong>
<span className="dashboard-kpi-detalle">Solicitudes canceladas</span>
</article>
</div>
</section>
<section className="calendario-seccion" aria-labelledby="calendario-citas-titulo">
<div className="calendario-encabezado">
<div>
<h2 id="calendario-citas-titulo">Calendario de citas</h2>
<p>Visualiza las solicitudes por <strong>fecha preferida</strong>. Selecciona un día para filtrar la lista de gestión.</p>
</div>
<div className="calendario-navegacion" aria-label="Cambiar mes del calendario">
<button type="button" id="calendarioMesAnterior" aria-label="Mes anterior" {...m.props["calendarioMesAnterior"]}>‹</button>
<h3 id="calendarioTitulo" aria-live="polite">{m.content["calendarioTitulo"]}</h3>
<button type="button" id="calendarioMesSiguiente" aria-label="Mes siguiente" {...m.props["calendarioMesSiguiente"]}>›</button>
</div>
</div>
<div className="calendario-panel">
<div className="calendario-semana" aria-hidden="true">
<span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
</div>
<div className="calendario-cuadricula" id="calendarioCuadricula" role="group" aria-label="Fechas del mes">{m.content["calendarioCuadricula"]}</div>
<div className="calendario-pie">
<p id="calendarioDiaSeleccionado" role="status">{m.content["calendarioDiaSeleccionado"]}</p>
<button type="button" id="limpiarDiaCalendario" className="btn btn-outline" {...m.props["limpiarDiaCalendario"]}>Mostrar todas las fechas</button>
</div>
</div>
</section>
<div className="panel-layout">
<div>
<form className="panel-crear" id="crearForm" {...m.props["crearForm"]}>
<fieldset>
<legend>Registrar cita de forma presencial o telefónica</legend>
<div className="field">
<label htmlFor="pNombre">Nombres y apellidos del paciente</label>
<input type="text" id="pNombre" required={true} minLength="4" {...m.props["pNombre"]} />
</div>
<div className="field">
<label htmlFor="pDni">DNI</label>
<input type="text" id="pDni" pattern="[0-9]{8}" maxLength="8" required={true} {...m.props["pDni"]} />
</div>
<div className="field">
<label htmlFor="pEspecialidad">Especialidad</label>
<select id="pEspecialidad" required={true} {...m.props["pEspecialidad"]}>
<option value="" disabled={true}>Selecciona una especialidad</option>
<option value="medicina-general">Medicina General</option>
<option value="pediatria">Pediatría</option>
<option value="ginecologia">Ginecología y Obstetricia</option>
<option value="cardiologia">Cardiología</option>
<option value="traumatologia">Traumatología</option>
<option value="cirugia-general">Cirugía General</option>
<option value="medicina-interna">Medicina Interna</option>
<option value="odontologia">Odontología</option>
<option value="oftalmologia">Oftalmología</option>
<option value="psicologia">Psicología</option>
</select>
</div>
<div className="field">
<label htmlFor="pFecha">Fecha preferida</label>
<input type="date" id="pFecha" required={true} {...m.props["pFecha"]} />
<span className="hint">Se guarda con id_usuario vacío (atención presencial/telefónica, sin cuenta propia).</span>
</div>
<div className="field">
<label><input type="checkbox" id="pSis" {...m.props["pSis"]} /> Paciente con SIS activo (exonerado de pago)</label>
</div>
<div className="monto-estimado">
<p>Monto del ticket: <output id="pMonto" htmlFor="pEspecialidad pSis" aria-live="polite">{m.content["pMonto"]}</output></p>
<p className="hint">Si tiene costo, el paciente paga luego en caja buscando su código.</p>
</div>
<button type="submit" className="btn btn-primary" disabled={m.busy}>Registrar cita</button>
</fieldset>
</form>
<section className="dashboard-consultas" aria-labelledby="gestionar-citas-titulo">
<div className="dashboard-consultas-head">
<div>
<h2 id="gestionar-citas-titulo">Buscar y gestionar solicitudes</h2>
<p>Busca por paciente, DNI o código y filtra por estado y especialidad.</p>
</div>
</div>
<div className="dashboard-filtros">
<div className="dashboard-filtro dashboard-filtro-buscar">
<label htmlFor="buscarCita">Buscar cita</label>
<input id="buscarCita" type="search" placeholder="Nombre, DNI o código" autoComplete="off" {...m.props["buscarCita"]} />
</div>
<div className="dashboard-filtro">
<label htmlFor="filtroEstado">Estado</label>
<select id="filtroEstado" {...m.props["filtroEstado"]}>
<option value="">Todos los estados</option>
<option value="registrado">Registradas</option>
<option value="atendido">Atendidas</option>
<option value="rechazado">Rechazadas</option>
<option value="cancelado">Canceladas</option>
</select>
</div>
<div className="dashboard-filtro">
<label htmlFor="filtroEspecialidad">Especialidad</label>
<select id="filtroEspecialidad" {...m.props["filtroEspecialidad"]}><Options all /></select>
</div>
<button id="limpiarFiltrosPanel" type="button" className="btn btn-outline" {...m.props["limpiarFiltrosPanel"]}>Limpiar filtros</button>
</div>
<p className="dashboard-contador" id="contadorCitas" role="status">{m.content["contadorCitas"]}</p>
</section>
<div className="skeleton" id="cargando" aria-hidden="true" {...m.props["cargando"]}><span></span><span></span><span></span></div>
<div className="panel-table-wrap">
<table className="panel-table" id="tablaPanel" {...m.props["tablaPanel"]}>
<thead>
<tr>
<th scope="col">Código</th>
<th scope="col">Paciente</th>
<th scope="col">DNI</th>
<th scope="col">Especialidad</th>
<th scope="col">Fecha preferida</th>
<th scope="col">Estado</th>
<th scope="col">Monto</th>
<th scope="col">Pago</th>
<th scope="col">Acciones</th>
</tr>
</thead>
<tbody id="cuerpoPanel">{m.content["cuerpoPanel"]}</tbody>
</table>
</div>
<p className="panel-vacio" id="panelVacio" {...m.props["panelVacio"]}>{m.content["panelVacio"]}</p>
</div>
</div>
</div>
</section>
</main>
<footer className="site-footer">
<div className="container">
<div>
<h4>Hospital Regional del Norte</h4>
<p>Área de administración y gestión de citas.</p>
</div>
</div>
</footer>



</Page>;
}

