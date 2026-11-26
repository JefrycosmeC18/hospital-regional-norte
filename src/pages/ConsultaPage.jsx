import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useConsulta} from '../hooks/useConsulta';
export default function ConsultaPage() {
  const m=useConsulta();
  return <Page name="consulta" title="Mis citas — Hospital Regional del Norte">
<div className="emergency-bar">
<div className="container">
<span>
<svg className="emergency-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
<g className="cross">
<path d="M12 4v16M4 12h16" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"></path>
</g>
</svg>
<strong>Emergencias:</strong> busca atención inmediata cuando sea necesario
      </span>
<Link to="/contacto">Canales de atención</Link>
</div>
</div>
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
<li><Link to="/servicios">Especialidades</Link></li>
<li><Link to="/como-funciona">Cómo pedir cita</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/registro">Solicitar cita</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link aria-current="page" to="/consulta">Mis citas</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/pago">Pagar</Link></li>
<li><Link to="/contacto">Contacto</Link></li>
<li className="nav-link-panel" hidden={!m.user || !["administrador","empleado"].includes(m.user.rol)} style={{display:m.user && ["administrador","empleado"].includes(m.user.rol)?"list-item":undefined}}><Link to="/panel">Panel</Link></li>

</ul>
</nav>
<HeaderTools /></div>
</header>
<main><Feedback error={m.error} loading={false} />
<section className="section">
<div className="container">
<div className="section-head">
<h1>Mis citas</h1>
<p>Estos son los registros de "Solicitud de cita" guardados a tu nombre en el sistema. Mientras el estado siga en <strong>registrado</strong> y no estén pagados, puedes editarlos. Si tienen costo, aquí mismo puedes pagarlos.</p>
</div>
<section className="mis-citas-busqueda" aria-labelledby="mis-citas-filtros-titulo">
<div className="mis-citas-titulo">
<h2 id="mis-citas-filtros-titulo">Encuentra tu cita</h2>
<p>Consulta los datos de tus solicitudes, sus estados y los pagos asociados.</p>
</div>
<div className="mis-citas-filtros">
<div className="mis-citas-campo">
<label htmlFor="buscarMisCitas">Buscar por código o especialidad</label>
<input type="search" id="buscarMisCitas" placeholder="Código de seguimiento o especialidad" autoComplete="off" {...m.props["buscarMisCitas"]} />
</div>
<div className="mis-citas-campo">
<label htmlFor="estadoMisCitas">Estado de la solicitud</label>
<select id="estadoMisCitas" {...m.props["estadoMisCitas"]}>
<option value="">Todos los estados</option>
<option value="registrado">Registradas</option>
<option value="atendido">Atendidas</option>
<option value="rechazado">Rechazadas</option>
<option value="cancelado">Canceladas</option>
</select>
</div>
<button type="button" className="btn btn-outline" id="limpiarMisCitas" {...m.props["limpiarMisCitas"]}>Limpiar filtros</button>
</div>
<p className="mis-citas-contador" id="contadorMisCitas" role="status">{m.content["contadorMisCitas"]}</p>
</section>
<div className="skeleton" id="cargando" aria-hidden="true" {...m.props["cargando"]}><span></span><span></span><span></span></div>
<div className="mis-citas-tarjetas" id="tarjetasMisCitas" aria-live="off">{m.content["tarjetasMisCitas"]}</div>
<details className="mis-citas-tabla-detalle" id="detalleTablaMisCitas" {...m.props["detalleTablaMisCitas"]}>
<summary>Ver mis citas en formato de tabla</summary>
<div className="registros-table-wrap">
<table className="registros-table" id="tablaRegistros" {...m.props["tablaRegistros"]}>
<thead>
<tr>
<th scope="col">Código</th>
<th scope="col">Especialidad</th>
<th scope="col">Fecha preferida</th>
<th scope="col">Estado</th>
<th scope="col">Monto</th>
<th scope="col">Pago</th>
<th scope="col">Registrado el</th>
<th scope="col">Acción</th>
</tr>
</thead>
<tbody id="cuerpoRegistros">{m.content["cuerpoRegistros"]}</tbody>
</table>
</div>
</details>
<p className="registros-vacio" id="registrosVacio" {...m.props["registrosVacio"]}>{m.content["registrosVacio"]}</p>
</div>
</section>
</main>
<footer className="site-footer">
<div className="container">
<div>
<h4>Hospital Regional del Norte</h4>
<p>Información sobre especialidades, citas y servicios de atención al paciente.</p>
</div>
<div>
<h4>Navegación</h4>
<ul>
<li><Link to="/servicios">Especialidades</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/registro">Solicitar cita</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/consulta">Mis citas</Link></li>
</ul>
</div>
<div>
<h4>Emergencia</h4>
<ul>
<li><Link to="/contacto">Canales de atención</Link></li>
<li><Link to="/contacto">Ver todas las sedes</Link></li>
</ul>
</div>
</div>
<p className="footer-bottom">© Hospital Regional del Norte · Atención al paciente.</p>
</footer>



</Page>;
}
