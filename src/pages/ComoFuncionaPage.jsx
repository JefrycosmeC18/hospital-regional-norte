import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useGuide} from '../hooks/useGuide';
export default function ComoFuncionaPage() {
  const m=useGuide();
  return <Page name="como-funciona" title="Cómo pedir una cita — Hospital Regional del Norte">
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
<li><Link aria-current="page" to="/como-funciona">Cómo pedir cita</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/registro">Solicitar cita</Link></li>
<li className="nav-link-panel" hidden={!m.user || !["administrador","empleado"].includes(m.user.rol)} style={{display:m.user && ["administrador","empleado"].includes(m.user.rol)?"list-item":undefined}}><Link to="/panel">Panel</Link></li>
<li hidden={!!m.user}><Link className="nav-link-login" to="/login">Iniciar sesión</Link></li>
<li><Link to="/contacto">Contacto</Link></li>
</ul>
</nav>
<HeaderTools /></div>
</header>
<main>
<section className="section">
<div className="container">
<div className="section-head">
<h1>Cómo pedir tu cita</h1>
<p>Conoce el proceso para solicitar una cita, preparar tus documentos y consultar su confirmación.</p>
</div>
<ol className="steps">
<li>
<div>
<h3>Elige la especialidad</h3>
<p>Revisa el listado de especialidades y ubica la que corresponde a tu malestar. Si tienes dudas, elige Medicina General: el médico te derivará si hace falta.</p>
</div>
</li>
<li>
<div>
<h3>Reúne tus documentos</h3>
<p>Ten a mano tu documento de identidad. Si corresponde, verifica tu afiliación al SIS y la indicación de referencia que te haya dado el personal de salud.</p>
</div>
</li>
<li>
<div>
<h3>Completa el formulario o llama a admisión</h3>
<p>Puedes ingresar una solicitud en línea, consultar la información registrada y revisar su estado desde el portal.</p>
</div>
</li>
<li>
<div>
<h3>Recibe la confirmación</h3>
<p>Revisa el mensaje del sistema y consulta el estado de tu solicitud. La fecha definitiva se confirma según disponibilidad.</p>
</div>
</li>
<li>
<div>
<h3>Prepara tu visita</h3>
<p>Antes de acudir, comprueba la fecha y hora asignadas, así como los requisitos de admisión.</p>
</div>
</li>
</ol>
</div>
</section>
<section className="section section--alt">
<div className="container">
<div className="section-head">
<h2>Requisitos según tu forma de atención</h2>
</div>
<figure className="photo-feature">
<div className="img-zoom"><img src="https://images.pexels.com/photos/33812025/pexels-photo-33812025.jpeg?auto=compress&cs=tinysrgb&w=1200&h=560&dpr=1" alt="Recepción de un centro de salud, donde el personal de admisión registra las citas" loading="lazy" width="1200" height="560" /></div>
<figcaption>Área de recepción y admisión.</figcaption>
</figure>
<div className="contact-grid">
<div className="contact-card">
<h3>Con Seguro Integral de Salud (SIS)</h3>
<ul className="requirements">
<li>DNI vigente del paciente</li>
<li>Verificar el estado de afiliación al SIS en sus canales oficiales</li>
<li>Hoja de referencia, si vienes de otro centro de salud</li>
<li>Consultar cuáles prestaciones corresponden a tu cobertura y establecimiento</li>
</ul>
</div>
<div className="contact-card">
<h3>Pago particular</h3>
<ul className="requirements">
<li>DNI vigente del paciente</li>
<li>Consultar las tarifas y los medios de pago disponibles</li>
<li>Conservar el comprobante si el trámite requiere pago</li>
<li>Verificar el tipo de comprobante que ofrece el establecimiento</li>
</ul>
</div>
</div>
</div>
</section>
<section className="section readiness-section" id="checklist-cita" aria-labelledby="checklist-titulo">
<div className="container">
<div className="readiness-layout">
<div>
<p className="info-kicker">Antes de comenzar</p>
<h2 id="checklist-titulo">Prepara tu solicitud de cita</h2>
<p>Marca los pasos completados y mantén organizados tus requisitos antes de solicitar una cita.</p>
<Link className="btn btn-outline" to="/servicios">Revisar especialidades</Link>
</div>
<div className="readiness-card">
<h3>Mi lista de preparación</h3>
<div className="readiness-progress" role="progressbar" aria-label="Progreso de preparación" aria-valuemin="0" aria-valuemax="4" id="progreso-barra" {...m.props["progreso-barra"]}>
<span id="progreso-relleno" {...m.props["progreso-relleno"]}></span>
</div>
<p className="readiness-count" id="progreso-texto" aria-live="polite">{m.content["progreso-texto"]}</p>
<div className="readiness-checks">
<label><input type="checkbox" className="readiness-item" {...m.check(0)} /> Revisé las especialidades del portal.</label>
<label><input type="checkbox" className="readiness-item" {...m.check(1)} /> Leí qué campos requiere el formulario.</label>
<label><input type="checkbox" className="readiness-item" {...m.check(2)} /> Comprendo que debo consultar la confirmación de mi cita.</label>
<label><input type="checkbox" className="readiness-item" {...m.check(3)} /> Revisé los datos que solicita el formulario.</label>
</div>
<button className="btn btn-primary" id="reiniciar-checklist" type="button" {...m.props["reiniciar-checklist"]}>Reiniciar lista</button>
</div>
</div>
</div>
</section>
<section className="section section--alt" id="ayuda-citas" aria-labelledby="ayuda-citas-titulo">
<div className="container">
<div className="section-head">
<p className="info-kicker">Sobre el registro de citas</p>
<h2 id="ayuda-citas-titulo">Qué puedes hacer en este portal</h2>
</div>
<div className="readiness-help-grid">
<article className="readiness-help-card"><h3>Registrar una solicitud</h3><p>Ingresa los datos solicitados y conserva el código para consultar tu trámite.</p><Link to="/registro">Abrir formulario →</Link></article>
<article className="readiness-help-card"><h3>Consultar un registro</h3><p>Accede a la sección de consultas para revisar el estado de tus solicitudes.</p><Link to="/consulta">Consultar cita →</Link></article>
<article className="readiness-help-card"><h3>Información de contacto</h3><p>Encuentra accesos a los canales de atención e información complementaria sobre servicios de salud.</p><Link to="/contacto">Ver contacto →</Link></article>
</div>
</div>
</section>
<section className="section">
<div className="container">
<div className="section-head">
<h2>¿Listo para reservar?</h2>
<p>Cuando tengas claro qué especialidad necesitas, continúa con el formulario de solicitud.</p>
</div>
<Link className="btn btn-accent" to="/registro">Solicitar cita ahora</Link>
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
