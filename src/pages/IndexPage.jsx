import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useStatic} from '../hooks/useStatic';
export default function IndexPage() {
  const m=useStatic();
  return <Page name="index" title="Hospital Regional del Norte — MINSA Piura">
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
<li><Link aria-current="page" to="/">Inicio</Link></li>
<li><Link to="/institucion">Institución</Link></li>
<li><Link to="/servicios">Especialidades</Link></li>
<li><Link to="/actualidad">Actualidad</Link></li>
<li><Link to="/como-funciona">Cómo pedir cita</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/registro">Solicitar cita</Link></li>
<li><Link to="/contacto">Contacto</Link></li>
<li className="nav-link-panel" hidden={!m.user || !["administrador","empleado"].includes(m.user.rol)} style={{display:m.user && ["administrador","empleado"].includes(m.user.rol)?"list-item":undefined}}><Link to="/panel">Panel</Link></li>
<li hidden={!!m.user}><Link className="nav-link-login" to="/login#iniciar">Iniciar Sesión</Link></li>
<li hidden={!!m.user}><Link className="nav-link-register" to="/login#registrar">Registrarte</Link></li>
</ul>
</nav>
<HeaderTools /></div>
</header>
<main>
<section className="hero hero-portada" aria-labelledby="portada">
<img className="hero-imagen" src="https://images.pexels.com/photos/9741531/pexels-photo-9741531.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1000&fit=crop" alt="Fachada de un edificio hospitalario con iluminación arquitectónica" width="1800" height="1000" fetchPriority="high" />
<div className="container">
<div className="hero-copy">
<span className="hero-acento" aria-hidden="true"></span>
<h1 id="portada">Hospital Regional del Norte</h1>
<p>Atención de calidad, con calidez humana y tecnología al servicio de tu salud.</p>
<div className="hero-actions">
<Link className="btn btn-primary" to="/registro"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M7 3v4M17 3v4M3 10h18M8 14h4"></path></svg>Solicitar cita</Link>
<Link className="btn btn-outline" to="/servicios"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 3v7a5 5 0 0 0 10 0V3M4 3h4M14 3h4M11 15v2a4 4 0 0 0 8 0v-1"></path><circle cx="19" cy="13" r="2"></circle></svg>Nuestros servicios</Link>
</div>
</div>
<div className="hero-beneficios" aria-label="Principios de atención">
<div className="beneficio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="9" cy="7" r="3"></circle><circle cx="17" cy="8" r="2"></circle><path d="M2 20v-3a6 6 0 0 1 12 0v3H2ZM16 14a5 5 0 0 1 6 5v1h-5"></path></svg><span>Atención<br />especializada</span></div>
<div className="beneficio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20.8 5.3A5.5 5.5 0 0 0 12 6 5.5 5.5 0 0 0 3.2 5.3C-1 10.2 7 18 12 21c5-3 13-10.8 8.8-15.7Z"></path><path d="M3 13h5l2-4 3 8 2-4h6"></path></svg><span>Equipamiento<br />moderno</span></div>
<div className="beneficio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 2 4 5v6c0 5.5 3.5 9.4 8 11 4.5-1.6 8-5.5 8-11V5l-8-3Z"></path><path d="m8.5 12 2.5 2.5 4.5-5"></path></svg><span>Atención segura<br />y confiable</span></div>
<div className="beneficio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 20s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.7A4.5 4.5 0 0 1 20 9c0 5.5-8 11-8 11Z"></path><path d="M2 17v3h5M22 17v3h-5"></path></svg><span>Compromiso con<br />la comunidad</span></div>
</div>
</div>
</section>
<section className="accesos-portal" aria-labelledby="accesos-titulo"><div className="container">
<div className="section-head"><p className="info-kicker">Accesos principales</p><h2 id="accesos-titulo">¿Qué necesitas hacer hoy?</h2><p>Encuentra rápidamente el trámite o servicio que necesitas.</p></div>
<div className="accesos-grid">
<Link to="/registro"><span>01</span><strong>Solicitar cita</strong><small>Formulario guiado para el paciente</small></Link>
<Link to="/consulta"><span>02</span><strong>Mis citas</strong><small>Estado, pagos y ruta de atención</small></Link>
<Link to="/servicios"><span>03</span><strong>Especialidades</strong><small>Áreas médicas del portal</small></Link>
<Link to="/contacto"><span>04</span><strong>Orientación</strong><small>Requisitos y canales informativos</small></Link>
</div>
</div></section>
<section className="quick-facts" aria-label="Datos del hospital">
<div className="container">
<div className="train-viewport" aria-label="Información destacada del hospital">
<Train className="facts-track train-track" id="datos-destacados" seconds={28}>
<dl>
<dt>Salud</dt>
<dd>Orientación para emergencias</dd>
</dl>
<dl>
<dt>10</dt>
<dd>Especialidades médicas</dd>
</dl>
<dl>
<dt>SIS</dt>
<dd>Orientación para afiliados al Seguro Integral de Salud</dd>
</dl>
<dl>
<dt>En línea</dt>
<dd>Solicitud y seguimiento de citas</dd>
</dl>
</Train>
</div>
</div>
</section>
<section className="section">
<div className="container">
<div className="section-head">
<h2>Espacios de atención</h2>
<p>Conoce los ambientes hospitalarios y las áreas de atención.</p>
</div>
<div className="photo-pair">
<figure>
<div className="img-zoom"><picture>
<source media="(max-width: 600px)" srcSet="https://images.pexels.com/photos/7659873/pexels-photo-7659873.jpeg?auto=compress&cs=tinysrgb&w=600&h=450&dpr=1" />
<source media="(min-width: 601px)" srcSet="https://images.pexels.com/photos/7659873/pexels-photo-7659873.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1" />
<img src="https://images.pexels.com/photos/7659873/pexels-photo-7659873.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1" alt="Personal de salud atendiendo a una paciente" loading="lazy" width="900" height="600" />
</picture></div>
<figcaption>Atención al paciente.</figcaption>
</figure>
<figure>
<div className="img-zoom"><img src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1" alt="Letrero de emergencia en rojo en la entrada de un hospital" loading="lazy" width="900" height="600" /></div>
<figcaption>Acceso al servicio de emergencias.</figcaption>
</figure>
</div>
</div>
</section>
<section className="section resumen-institucion" aria-labelledby="resumen-titulo"><div className="container resumen-institucion-grid">
<div><p className="info-kicker">Conócenos</p><h2 id="resumen-titulo">Un portal hospitalario pensado para orientar a las personas</h2><p>Reunimos información de atención y herramientas digitales para gestionar solicitudes de citas. Conoce nuestras áreas funcionales y el recorrido del paciente.</p><Link className="btn btn-outline" to="/institucion">Conocer nuestra institución</Link></div>
<div className="resumen-pilares"><article><span>01</span><h3>Orientación clara</h3><p>Guías, trámites y especialidades al alcance del paciente.</p></article><article><span>02</span><h3>Gestión digital</h3><p>Citas, estados y reportes dentro de un mismo sistema.</p></article><article><span>03</span><h3>Accesibilidad</h3><p>Un modo fácil para mejorar la lectura y el contraste.</p></article></div>
</div></section>
<section className="section" id="especialidades-destacadas">
<div className="container">
<div className="section-head">
<h2>Especialidades destacadas</h2>
<p>Conoce algunas de nuestras áreas de atención. Puedes revisar las demás opciones en la página de especialidades.</p>
</div>
<div className="train-viewport" aria-label="Especialidades destacadas">
<Train className="specialty-cards train-track" id="tarjetas-destacadas" seconds={36}>
<ul className="train-set">
<li className="specialty-card">
<h3>Medicina General</h3>
<p>Primera consulta, control de enfermedades comunes y derivación a especialidad si es necesario.</p>
<span className="specialty-tag">Sin referencia</span>
</li>
<li className="specialty-card">
<h3>Pediatría</h3>
<p>Control de crecimiento, vacunas y atención de niñas, niños y adolescentes hasta los 17 años.</p>
<span className="specialty-tag">Sin referencia</span>
</li>
<li className="specialty-card">
<h3>Ginecología y Obstetricia</h3>
<p>Control prenatal, planificación familiar y salud de la mujer.</p>
<span className="specialty-tag">Con SIS</span>
</li>
<li className="specialty-card">
<h3>Emergencia</h3>
<p>Atención inmediata para casos que ponen en riesgo la vida, sin necesidad de cita.</p>
<span className="specialty-tag" data-tag="emergencia">24 horas</span>
</li>
</ul>
</Train>
</div>
<div className="specialty-footer">
<Link className="btn btn-outline" to="/servicios">Ver las 10 especialidades</Link>
</div>
</div>
</section>
<section className="section section--alt">
<div className="container">
<div className="section-head">
<h2>Solicita una cita médica</h2>
<p>Puedes enviar una solicitud desde el formulario del portal y consultar su estado con el código de seguimiento.</p>
</div>
<Link className="btn btn-accent" to="/registro">Ir al formulario de citas</Link>
</div>
</section>
<section className="section section--alt" id="novedades-portal" aria-labelledby="novedades-titulo"><div className="container">
<div className="section-head"><p className="info-kicker">Información y novedades</p><h2 id="novedades-titulo">Actualidad del portal</h2><p>Novedades y recursos de orientación para pacientes y familiares.</p></div>
<div className="novedades-grid">
<article><span>ORIENTACIÓN</span><h3>Cómo prepararte para solicitar una cita</h3><p>Documentos, especialidad y fechas para completar una solicitud.</p><Link to="/como-funciona">Leer guía →</Link></article>
<article><span>ACCESIBILIDAD</span><h3>Modo fácil para pacientes</h3><p>Opciones para ajustar el tamaño de letra y contraste visual.</p><Link to="/institucion#servicios-digitales">Ver funciones →</Link></article>
<article><span>GESTIÓN DIGITAL</span><h3>Seguimiento y reportes administrativos</h3><p>Conoce las herramientas de gestión y seguimiento de citas.</p><Link to="/actualidad">Ver novedades →</Link></article>
</div>
</div></section>

<section className="section section--alt" id="orientacion-paciente" aria-labelledby="orientacion-titulo">
<div className="container">
<div className="section-head">
<p className="info-kicker">Orientación al paciente</p>
<h2 id="orientacion-titulo">Toda la información para preparar tu atención</h2>
<p>Revisa los requisitos generales, conoce nuestros servicios y prepárate para solicitar una cita.</p>
</div>
<div className="orientation-grid">
<article className="orientation-card">
<span className="orientation-number" aria-hidden="true">01</span>
<h3>Elige la especialidad</h3>
<p>Revisa las áreas disponibles y las orientaciones generales de consulta. Si no sabes qué especialidad elegir, consulta primero con personal de salud.</p>
<Link to="/servicios">Explorar especialidades <span aria-hidden="true">→</span></Link>
</article>
<article className="orientation-card">
<span className="orientation-number" aria-hidden="true">02</span>
<h3>Prepara tu documentación</h3>
<p>Ten a mano tu documento de identidad y, si corresponde, la información de tu seguro o referencia. Los requisitos concretos dependen de cada atención.</p>
<Link to="/como-funciona">Ver guía de citas <span aria-hidden="true">→</span></Link>
</article>
<article className="orientation-card">
<span className="orientation-number" aria-hidden="true">03</span>
<h3>Solicita y consulta</h3>
<p>Registra tu solicitud y consulta su estado desde el portal.</p>
<Link to="/registro">Ir a solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="orientation-card">
<span className="orientation-number" aria-hidden="true">04</span>
<h3>Identifica una emergencia</h3>
<p>Una situación que requiere atención inmediata no debe esperar una cita programada. Acude a un establecimiento de emergencia o utiliza los canales oficiales de tu localidad.</p>
<Link to="/contacto">Ver orientación de contacto <span aria-hidden="true">→</span></Link>
</article>
</div>
</div>
</section>

<section className="section visit-section" id="pasos-cita" aria-labelledby="pasos-titulo">
<div className="container">
<div className="section-head">
<p className="info-kicker">Guía de uso del portal</p>
<h2 id="pasos-titulo">Tu solicitud de cita, en cuatro pasos</h2>
<p>Sigue estos pasos para elegir una especialidad, completar tu solicitud y consultar el registro.</p>
</div>
<ol className="visit-steps">
<li><strong>Selecciona el servicio</strong><span>Consulta las especialidades y sus indicaciones.</span></li>
<li><strong>Completa la solicitud</strong><span>Completa los campos del formulario con los datos solicitados.</span></li>
<li><strong>Revisa la confirmación</strong><span>Comprueba el mensaje y el resultado que muestra el formulario.</span></li>
<li><strong>Consulta el registro</strong><span>Utiliza la opción de consulta para comprobar la información.</span></li>
</ol>
<div className="visit-actions">
<Link className="btn btn-primary" to="/registro">Comenzar solicitud</Link>
<Link className="btn btn-outline" to="/consulta">Consultar solicitudes</Link>
</div>
</div>
</section>

<section className="section section--alt faq-section" id="preguntas-frecuentes" aria-labelledby="faq-titulo">
<div className="container">
<div className="section-head">
<p className="info-kicker">Preguntas frecuentes</p>
<h2 id="faq-titulo">Resuelve tus dudas antes de solicitar una cita</h2>
<p>Encuentra respuestas a las dudas más frecuentes sobre citas, especialidades y atención.</p>
</div>
<div className="faq-list">
<details>
<summary>¿Cómo puedo elegir una especialidad?<span aria-hidden="true" className="faq-symbol">+</span></summary>
<div className="faq-answer"><p>Visita <Link to="/servicios">Especialidades</Link> para revisar las opciones disponibles. Si no sabes cuál elegir, solicita orientación al personal de salud.</p></div>
</details>
<details>
<summary>¿Qué información necesito para registrar una solicitud?<span aria-hidden="true" className="faq-symbol">+</span></summary>
<div className="faq-answer"><p>El formulario indica los datos necesarios para registrar tu solicitud. Consulta también la guía <Link to="/como-funciona">Cómo pedir cita</Link>.</p></div>
</details>
<details>
<summary>¿Cómo compruebo si registré mi solicitud?<span aria-hidden="true" className="faq-symbol">+</span></summary>
<div className="faq-answer"><p>Después de enviar la solicitud, consulta el código de seguimiento en <Link to="/consulta">Mis citas</Link>. La asignación definitiva depende de la disponibilidad y la confirmación del servicio.</p></div>
</details>
<details>
<summary>¿Qué hago si tengo una emergencia?<span aria-hidden="true" className="faq-symbol">+</span></summary>
<div className="faq-answer"><p>No esperes una respuesta del formulario. Busca atención inmediata en un servicio de emergencias y consulta los canales oficiales de salud de tu localidad.</p></div>
</details>
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
