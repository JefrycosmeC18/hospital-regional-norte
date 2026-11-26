import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useStatic} from '../hooks/useStatic';
export default function ContactoPage() {
  const m=useStatic();
  return <Page name="contacto" title="Contacto y orientación — Hospital Regional del Norte">
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
<li className="nav-link-panel" hidden={!m.user || !["administrador","empleado"].includes(m.user.rol)} style={{display:m.user && ["administrador","empleado"].includes(m.user.rol)?"list-item":undefined}}><Link to="/panel">Panel</Link></li>
<li hidden={!!m.user}><Link className="nav-link-login" to="/login">Iniciar sesión</Link></li>
<li><Link aria-current="page" to="/contacto">Contacto</Link></li>
</ul>
</nav>
<HeaderTools /></div>
</header>
<main>
<section className="section">
<div className="container">
<div className="section-head">
<h1>Contacto y orientación</h1>
<p>Encuentra las principales opciones de atención, consulta tus solicitudes y accede a información sobre servicios de salud.</p>
</div>
<figure className="photo-feature">
<div className="img-zoom"><img src="https://images.pexels.com/photos/8459996/pexels-photo-8459996.jpeg?auto=compress&cs=tinysrgb&w=1200&h=560&dpr=1" alt="Sala de espera limpia y luminosa de un centro de salud" loading="lazy" width="1200" height="560" /></div>
<figcaption>Área de espera y recepción.</figcaption>
</figure>
<div className="contact-grid">
<div className="contact-card">
<h3>Atención y consultas</h3>
<dl>
<dt>Citas médicas</dt>
<dd><Link to="/registro">Ingresar una solicitud de cita</Link></dd>
<dt>Seguimiento</dt>
<dd><Link to="/consulta">Consultar el estado de una solicitud</Link></dd>
<dt>Especialidades</dt>
<dd><Link to="/servicios#horarios">Consultar servicios y horarios</Link></dd>
<dt>Orientación</dt>
<dd><Link to="/como-funciona">Conocer los pasos y requisitos</Link></dd>
</dl>
</div>
<div className="map-frame">
<h3>Información sobre la atención</h3>
<p>Antes de acudir, consulta la programación de especialidades, los requisitos de admisión y la información de contacto disponible.</p>
<Link className="btn btn-outline" to="/servicios#horarios">Ver especialidades y horarios</Link>
</div>
</div>
</div>
</section>
<section className="section section--alt">
<div className="container">
<div className="section-head">
<h2>Otros canales de atención</h2>
</div>
<div className="contact-grid">
<div className="contact-card">
<h3>Consultas por Mesa de Partes Virtual</h3>
<p>Para trámites administrativos, documentos y quejas formales, usa la Mesa de Partes Virtual del MINSA.</p>
<a className="btn btn-outline" href="https://www.gob.pe/minsa" target="_blank" rel="noopener noreferrer">Ir a gob.pe/minsa</a>
</div>
<div className="contact-card">
<h3>Consultas para asegurados SIS</h3>
<p>Verifica tu afiliación o resuelve dudas sobre coberturas directamente con el Seguro Integral de Salud.</p>
<a className="btn btn-outline" href="https://www.gob.pe/sis" target="_blank" rel="noopener noreferrer">Ir al portal oficial del SIS</a>
</div>
</div>
</div>
</section>
<section className="section" id="orientacion-contacto" aria-labelledby="orientacion-contacto-titulo">
<div className="container">
<div className="section-head">
<p className="contact-kicker">Accesos rápidos</p>
<h2 id="orientacion-contacto-titulo">¿Qué trámite necesitas realizar?</h2>
<p>Selecciona el trámite que necesitas realizar y accede directamente a la sección correspondiente.</p>
</div>
<div className="contact-actions-grid">
<article className="contact-action">
<span className="contact-action-number" aria-hidden="true">01</span>
<h3>Solicitar una cita</h3>
<p>Completa el formulario del proyecto, revisa sus campos obligatorios y observa el mensaje de registro.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="contact-action">
<span className="contact-action-number" aria-hidden="true">02</span>
<h3>Consultar un registro</h3>
<p>Consulta el estado de tus solicitudes desde el portal.</p>
<Link to="/consulta">Consultar solicitudes <span aria-hidden="true">→</span></Link>
</article>
<article className="contact-action">
<span className="contact-action-number" aria-hidden="true">03</span>
<h3>Prepararte para la atención</h3>
<p>Lee los pasos del portal, revisa los requisitos generales y practica con la lista interactiva.</p>
<Link to="/como-funciona#checklist-cita">Ver guía de atención <span aria-hidden="true">→</span></Link>
</article>
</div>
</div>
</section>
<section className="section section--alt" id="informacion-oficial" aria-labelledby="informacion-oficial-titulo">
<div className="container">
<div className="section-head">
<p className="contact-kicker">Canales oficiales externos</p>
<h2 id="informacion-oficial-titulo">Información y trámites de salud</h2>
<p>Encuentra información adicional sobre servicios de salud y cobertura en los canales públicos disponibles.</p>
</div>
<div className="contact-official-links">
<a href="https://www.gob.pe/minsa" target="_blank" rel="noopener noreferrer"><strong>Ministerio de Salud</strong><span>Información y servicios del MINSA <span aria-hidden="true">↗</span></span></a>
<a href="https://www.gob.pe/sis" target="_blank" rel="noopener noreferrer"><strong>Seguro Integral de Salud</strong><span>Información y afiliación al SIS <span aria-hidden="true">↗</span></span></a>
<a href="https://www.gob.pe/10337-verificar-si-estas-afiliado-al-sis" target="_blank" rel="noopener noreferrer"><strong>Consulta de afiliación SIS</strong><span>Verificación desde gob.pe <span aria-hidden="true">↗</span></span></a>
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
<li><Link to="/servicios">Especialidades</Link></li>
<li><Link to="/como-funciona">Cómo pedir cita</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/registro">Solicitar cita</Link></li>
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
