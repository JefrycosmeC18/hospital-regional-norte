import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useComprobante} from '../hooks/useComprobante';
export default function ComprobantePage() {
  const m=useComprobante();
  return <Page name="comprobante" title="Constancia de pago — Hospital Regional del Norte">

<div className="carga-pantalla" aria-hidden="true">
<div className="carga-escena">
<div className="carga-suelo"></div>
<div className="carga-x">
<div className="carga-y">
<svg className="carga-moneda" viewBox="0 0 48 48" focusable="false">
<circle cx="24" cy="24" r="22" fill="#0F5D52"></circle>
<circle cx="24" cy="24" r="18.5" fill="none" stroke="#F2F5F1" strokeOpacity="0.35" strokeWidth="1"></circle>
<path d="M24 12v24M12 24h24" stroke="#F2F5F1" strokeWidth="5" strokeLinecap="round"></path>
<circle cx="24" cy="24" r="22" fill="none" stroke="#E0762E" strokeWidth="2"></circle>
</svg>
</div>
</div>
<div className="carga-onda"></div>
<div className="carga-chispas">
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
</div>
<div className="carga-soles">S/</div>
</div>
</div>
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
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/registro">Solicitar cita</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/consulta">Mis citas</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/pago">Pagar</Link></li>

</ul>
</nav>
<HeaderTools /></div>
</header>
<main><Feedback error={m.error} loading={false} />
<section className="section">
<div className="container">
<div className="section-head">
<h1>Constancia de pago</h1>
<p>Conserva este comprobante como respaldo del pago de tu cita.</p>
</div>
<section id="comprobante" className="comprobante" aria-live="polite">{m.content["comprobante"]}</section>
<div className="acciones">
<button type="button" id="imprimir" className="btn btn-primary" {...m.props["imprimir"]}>Imprimir</button>
<Link id="volver" className="btn btn-outline" {...m.props["volver"]}>Volver</Link>
</div>
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
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/registro">Solicitar cita</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/consulta">Mis citas</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/pago">Pagar</Link></li>
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
<p className="footer-bottom">Portal de pagos en entorno de pruebas. No introduzcas datos de tarjetas reales.</p>
</footer>



</Page>;
}
