import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useStatic} from '../hooks/useStatic';
export default function InstitucionPage() {
  const m=useStatic();
  return <Page name="institucion" title="Institución — Hospital Regional del Norte">
<header className="site-header"><div className="container"><Link className="brand" to="/"><svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
<circle cx="24" cy="24" r="22" fill="#0F5D52"></circle>
<path d="M24 12v24M12 24h24" stroke="#F2F5F1" strokeWidth="5" strokeLinecap="round"></path>
<circle cx="24" cy="24" r="22" fill="none" stroke="#E0762E" strokeWidth="2"></circle>
</svg><span className="brand-text"><strong className="name">Hospital Regional del Norte</strong><span className="tagline">Piura</span></span></Link><input className="nav-toggle" id="nav-toggle" type="checkbox" checked={m.menu} onChange={e=>m.setMenu(e.target.checked)} /><label className="nav-toggle-label" htmlFor="nav-toggle" aria-label="Abrir menú"><span></span><span></span><span></span></label><nav className="main-nav" aria-label="Navegación"><ul><li><Link to="/">Inicio</Link></li><li><Link aria-current="page" to="/institucion">Institución</Link></li><li><Link to="/servicios">Especialidades</Link></li><li><Link to="/actualidad">Actualidad</Link></li><li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/registro">Citas</Link></li><li><Link to="/contacto">Contacto</Link></li></ul></nav><HeaderTools /></div></header>
<main><section className="section pagina-portada-institucional"><div className="container"><p className="info-kicker">Presentación institucional</p><h1>Conoce el Hospital Regional del Norte</h1><p>Información de servicios hospitalarios y herramientas digitales para organizar solicitudes de atención.</p></div></section>
<section className="section"><div className="container"><div className="section-head"><h2>Nuestra identidad</h2><p>Diseñamos la experiencia en torno a las necesidades informativas de pacientes, familiares y personal administrativo.</p></div><div className="orientation-grid">
<article className="orientation-card"><h3>Misión</h3><p>Facilitar el acceso a información clara y la gestión ordenada de solicitudes de atención mediante un portal sencillo, inclusivo y confiable.</p></article>
<article className="orientation-card"><h3>Visión</h3><p>Construir una experiencia digital hospitalaria que permita a pacientes y personal conocer trámites, consultar citas y mejorar los procesos de atención.</p></article>
<article className="orientation-card"><h3>Nuestros valores</h3><p>Respeto por el paciente, responsabilidad con sus datos, orientación clara, accesibilidad y mejora continua.</p></article>
<article className="orientation-card"><h3>Objetivo del portal</h3><p>Integrar en una misma interfaz especialidades, solicitudes de citas, seguimiento, pagos de prueba y reportes administrativos.</p></article>
</div></div></section>
<section className="section section--alt" id="organizacion"><div className="container"><div className="section-head"><h2>Organización funcional</h2><p>Conoce cómo se relacionan las áreas de atención, gestión y administración del portal.</p></div><div className="orientation-grid">
<article className="orientation-card"><span className="orientation-number">01</span><h3>Gestión administrativa</h3><p>Supervisa solicitudes, estados de atención, indicadores y reportes.</p></article>
<article className="orientation-card"><span className="orientation-number">02</span><h3>Atención al paciente</h3><p>Orienta, recibe solicitudes y organiza los procesos de consulta.</p></article>
<article className="orientation-card"><span className="orientation-number">03</span><h3>Áreas médicas</h3><p>Especialidades y servicios descritos en el catálogo de atención.</p></article>
<article className="orientation-card"><span className="orientation-number">04</span><h3>Gestión de pagos</h3><p>Registra estados de pago y exoneración en el sistema.</p></article>
</div></div></section>
<section className="section" id="servicios-digitales"><div className="container"><div className="section-head"><h2>Servicios digitales del portal</h2><p>Desde una solicitud hasta su seguimiento, con funciones adecuadas a cada rol.</p></div><div className="novedades-grid"><article><h3>Solicitudes médicas</h3><p>Formulario guiado con validación y fecha preferida.</p><Link to="/registro">Solicitar cita →</Link></article><article><h3>Seguimiento al paciente</h3><p>Consulta del estado de la solicitud, pagos y ruta de atención.</p><Link to="/consulta">Mis citas →</Link></article><article><h3>Modo fácil</h3><p>El botón del encabezado permite ampliar textos y mejorar el contraste.</p><Link to="/como-funciona">Ver orientación →</Link></article></div></div></section></main>
<footer className="site-footer"><div className="container"><div><h4>Hospital Regional del Norte</h4><p>Información, servicios y orientación al paciente.</p></div><div><h4>Explora</h4><p><Link to="/">Inicio</Link> · <Link to="/actualidad">Novedades</Link></p></div><div><h4>Atención</h4><p><Link to="/contacto">Orientación y contacto</Link></p></div></div></footer>
</Page>;
}

