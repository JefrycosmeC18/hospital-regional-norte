import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useServices} from '../hooks/useServices';
export default function ServiciosPage() {
  const m=useServices([{"text": "Orientación de especialidad Medicina General Consulta inicial y controles de salud Atiende problemas de salud frecuentes, seguimiento general y orientación para acudir a una especialidad cuando corresponda. Solicitar cita →", "category": "general", "name": "Medicina General"}, {"text": "Orientación de especialidad Pediatría Atención orientada a niñas, niños y adolescentes Se enfoca en el crecimiento, desarrollo y la salud de la población pediátrica. Solicitar cita →", "category": "familiar", "name": "Pediatría"}, {"text": "Orientación de especialidad Ginecología y Obstetricia Salud de la mujer y seguimiento del embarazo Brinda orientación sobre salud ginecológica y controles durante la gestación. Solicitar cita →", "category": "familiar", "name": "Ginecología y Obstetricia"}, {"text": "Orientación de especialidad Cardiología Evaluación de la salud cardiovascular Se ocupa de enfermedades y alteraciones relacionadas con el corazón y el sistema circulatorio. Solicitar cita →", "category": "especializada", "name": "Cardiología"}, {"text": "Orientación de especialidad Traumatología Sistema musculoesquelético Evalúa lesiones y problemas de huesos, articulaciones, músculos y ligamentos. Solicitar cita →", "category": "especializada", "name": "Traumatología"}, {"text": "Orientación de especialidad Cirugía General Valoración de condiciones quirúrgicas Realiza evaluaciones y procedimientos quirúrgicos según indicación profesional. Solicitar cita →", "category": "especializada", "name": "Cirugía General"}, {"text": "Orientación de especialidad Medicina Interna Atención clínica integral de personas adultas Estudia y maneja enfermedades complejas o condiciones que requieren seguimiento especializado. Solicitar cita →", "category": "especializada", "name": "Medicina Interna"}, {"text": "Orientación de especialidad Oftalmología Salud de los ojos y la visión Evalúa problemas oculares y alteraciones visuales. Solicitar cita →", "category": "especializada", "name": "Oftalmología"}, {"text": "Orientación de especialidad Odontología Cuidado de la salud bucal Orienta sobre prevención, evaluación y atención de dientes y encías. Solicitar cita →", "category": "bienestar", "name": "Odontología"}, {"text": "Orientación de especialidad Psicología Bienestar emocional y salud mental Brinda evaluación y acompañamiento psicológico según las necesidades de cada persona. Solicitar cita →", "category": "bienestar", "name": "Psicología"}, {"text": "Atención urgente Emergencia Situaciones que requieren atención inmediata El servicio de emergencia está destinado a situaciones urgentes y no se gestiona mediante el formulario de citas. Ver orientación de contacto →", "category": "emergencia", "name": "Emergencia"}]);
  return <Page name="servicios" title="Especialidades — Hospital Regional del Norte">
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
<li><Link aria-current="page" to="/servicios">Especialidades</Link></li>
<li><Link to="/como-funciona">Cómo pedir cita</Link></li>
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
<h1>Especialidades y servicios</h1>
<p>Consulta externa por especialidad, con y sin cobertura del Seguro Integral de Salud (SIS). Si no estás seguro de qué especialidad necesitas, empieza por Medicina General.</p>
</div>
<figure className="photo-feature">
<div className="img-zoom"><img src="https://images.pexels.com/photos/7659873/pexels-photo-7659873.jpeg?auto=compress&cs=tinysrgb&w=800&h=373&dpr=1" srcSet="\n              https://images.pexels.com/photos/7659873/pexels-photo-7659873.jpeg?auto=compress&cs=tinysrgb&w=480&h=224&dpr=1 480w,\n              https://images.pexels.com/photos/7659873/pexels-photo-7659873.jpeg?auto=compress&cs=tinysrgb&w=800&h=373&dpr=1 800w,\n              https://images.pexels.com/photos/7659873/pexels-photo-7659873.jpeg?auto=compress&cs=tinysrgb&w=1200&h=560&dpr=1 1200w" sizes="(max-width: 700px) 100vw, 74rem" alt="Un médico conversa con una paciente durante una consulta" loading="lazy" width="1200" height="560" /></div>
<figcaption>Área de consulta externa.</figcaption>
</figure>
</div>
</section>

<section className="section" id="guia-especialidades" aria-labelledby="guia-especialidades-titulo">
<div className="container">
<div className="section-head">
<p className="info-kicker">Conoce los servicios del portal</p>
<h2 id="guia-especialidades-titulo">Información para elegir tu especialidad</h2>
<p>Explora las diez especialidades del proyecto y el servicio de emergencias. Las descripciones ayudan a identificar el área de atención más adecuada. Ante dudas, solicita orientación médica.</p>
</div>
<div className="service-filter" role="search" aria-label="Filtrar especialidades del hospital">
<div className="service-filter-field">
<label htmlFor="buscador-especialidades">Buscar especialidad</label>
<input id="buscador-especialidades" type="search" placeholder="Ejemplo: pediatría o cardiología" autoComplete="off" {...m.props["buscador-especialidades"]} />
</div>
<div className="service-filter-field">
<label htmlFor="categoria-especialidades">Tipo de atención</label>
<select id="categoria-especialidades" {...m.props["categoria-especialidades"]}>
<option value="todas">Todas</option>
<option value="general">Atención general</option>
<option value="familiar">Familia y maternidad</option>
<option value="especializada">Especialidades clínicas</option>
<option value="bienestar">Salud integral</option>
<option value="emergencia">Emergencias</option>
</select>
</div>
<button id="limpiar-especialidades" type="button" className="btn btn-outline" {...m.props["limpiar-especialidades"]}>Limpiar filtros</button>
</div>
<p id="resultados-especialidades" className="service-result-count" aria-live="polite">{m.content["resultados-especialidades"]}</p>
<div className="service-detail-grid" id="tarjetas-especialidades">
<article className="service-detail-card" data-categoria="general" hidden={!m.visible("Orientación de especialidad Medicina General Consulta inicial y controles de salud Atiende problemas de salud frecuentes, seguimiento general y orientación para acudir a una especialidad cuando corresponda. Solicitar cita →","general")}>
<span className="service-eyebrow">Orientación de especialidad</span>
<h3>Medicina General</h3>
<p className="service-subtitle">Consulta inicial y controles de salud</p>
<p>Atiende problemas de salud frecuentes, seguimiento general y orientación para acudir a una especialidad cuando corresponda.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="service-detail-card" data-categoria="familiar" hidden={!m.visible("Orientación de especialidad Pediatría Atención orientada a niñas, niños y adolescentes Se enfoca en el crecimiento, desarrollo y la salud de la población pediátrica. Solicitar cita →","familiar")}>
<span className="service-eyebrow">Orientación de especialidad</span>
<h3>Pediatría</h3>
<p className="service-subtitle">Atención orientada a niñas, niños y adolescentes</p>
<p>Se enfoca en el crecimiento, desarrollo y la salud de la población pediátrica.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="service-detail-card" data-categoria="familiar" hidden={!m.visible("Orientación de especialidad Ginecología y Obstetricia Salud de la mujer y seguimiento del embarazo Brinda orientación sobre salud ginecológica y controles durante la gestación. Solicitar cita →","familiar")}>
<span className="service-eyebrow">Orientación de especialidad</span>
<h3>Ginecología y Obstetricia</h3>
<p className="service-subtitle">Salud de la mujer y seguimiento del embarazo</p>
<p>Brinda orientación sobre salud ginecológica y controles durante la gestación.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="service-detail-card" data-categoria="especializada" hidden={!m.visible("Orientación de especialidad Cardiología Evaluación de la salud cardiovascular Se ocupa de enfermedades y alteraciones relacionadas con el corazón y el sistema circulatorio. Solicitar cita →","especializada")}>
<span className="service-eyebrow">Orientación de especialidad</span>
<h3>Cardiología</h3>
<p className="service-subtitle">Evaluación de la salud cardiovascular</p>
<p>Se ocupa de enfermedades y alteraciones relacionadas con el corazón y el sistema circulatorio.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="service-detail-card" data-categoria="especializada" hidden={!m.visible("Orientación de especialidad Traumatología Sistema musculoesquelético Evalúa lesiones y problemas de huesos, articulaciones, músculos y ligamentos. Solicitar cita →","especializada")}>
<span className="service-eyebrow">Orientación de especialidad</span>
<h3>Traumatología</h3>
<p className="service-subtitle">Sistema musculoesquelético</p>
<p>Evalúa lesiones y problemas de huesos, articulaciones, músculos y ligamentos.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="service-detail-card" data-categoria="especializada" hidden={!m.visible("Orientación de especialidad Cirugía General Valoración de condiciones quirúrgicas Realiza evaluaciones y procedimientos quirúrgicos según indicación profesional. Solicitar cita →","especializada")}>
<span className="service-eyebrow">Orientación de especialidad</span>
<h3>Cirugía General</h3>
<p className="service-subtitle">Valoración de condiciones quirúrgicas</p>
<p>Realiza evaluaciones y procedimientos quirúrgicos según indicación profesional.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="service-detail-card" data-categoria="especializada" hidden={!m.visible("Orientación de especialidad Medicina Interna Atención clínica integral de personas adultas Estudia y maneja enfermedades complejas o condiciones que requieren seguimiento especializado. Solicitar cita →","especializada")}>
<span className="service-eyebrow">Orientación de especialidad</span>
<h3>Medicina Interna</h3>
<p className="service-subtitle">Atención clínica integral de personas adultas</p>
<p>Estudia y maneja enfermedades complejas o condiciones que requieren seguimiento especializado.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="service-detail-card" data-categoria="especializada" hidden={!m.visible("Orientación de especialidad Oftalmología Salud de los ojos y la visión Evalúa problemas oculares y alteraciones visuales. Solicitar cita →","especializada")}>
<span className="service-eyebrow">Orientación de especialidad</span>
<h3>Oftalmología</h3>
<p className="service-subtitle">Salud de los ojos y la visión</p>
<p>Evalúa problemas oculares y alteraciones visuales.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="service-detail-card" data-categoria="bienestar" hidden={!m.visible("Orientación de especialidad Odontología Cuidado de la salud bucal Orienta sobre prevención, evaluación y atención de dientes y encías. Solicitar cita →","bienestar")}>
<span className="service-eyebrow">Orientación de especialidad</span>
<h3>Odontología</h3>
<p className="service-subtitle">Cuidado de la salud bucal</p>
<p>Orienta sobre prevención, evaluación y atención de dientes y encías.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="service-detail-card" data-categoria="bienestar" hidden={!m.visible("Orientación de especialidad Psicología Bienestar emocional y salud mental Brinda evaluación y acompañamiento psicológico según las necesidades de cada persona. Solicitar cita →","bienestar")}>
<span className="service-eyebrow">Orientación de especialidad</span>
<h3>Psicología</h3>
<p className="service-subtitle">Bienestar emocional y salud mental</p>
<p>Brinda evaluación y acompañamiento psicológico según las necesidades de cada persona.</p>
<Link to="/registro">Solicitar cita <span aria-hidden="true">→</span></Link>
</article>
<article className="service-detail-card" data-categoria="emergencia" hidden={!m.visible("Atención urgente Emergencia Situaciones que requieren atención inmediata El servicio de emergencia está destinado a situaciones urgentes y no se gestiona mediante el formulario de citas. Ver orientación de contacto →","emergencia")}>
<span className="service-eyebrow">Atención urgente</span>
<h3>Emergencia</h3>
<p className="service-subtitle">Situaciones que requieren atención inmediata</p>
<p>El servicio de emergencia está destinado a situaciones urgentes y no se gestiona mediante el formulario de citas.</p>
<Link to="/contacto">Ver orientación de contacto <span aria-hidden="true">→</span></Link>
</article>
</div>
<p id="sin-resultados-especialidades" className="service-no-results" {...m.props["sin-resultados-especialidades"]}>No encontramos resultados. Prueba con otra palabra o elimina los filtros.</p>
</div>
</section>
<section className="section section--alt" id="horarios">
<div className="container">
<div className="section-head">
<h2>Horario de atención por especialidad</h2>
<p>Consulta los horarios por especialidad. Estos pueden cambiar según programación médica y disponibilidad.</p>
</div>
<div className="schedule-table-wrap">
<table className="schedule-table">
<caption>Horarios orientativos de consulta externa. Verifica la disponibilidad antes de acudir.</caption>
<thead>
<tr>
<th scope="col">Especialidad</th>
<th scope="col">Días</th>
<th scope="col">Horario</th>
<th scope="col">Consultorio</th>
<th scope="col">Modalidad</th>
</tr>
</thead>
<tbody>
<tr data-categoria="general" hidden={!m.schedule("Medicina General")}>
<td>Medicina General</td>
<td>Lunes a sábado</td>
<td>7:00 a.m. – 3:00 p.m.</td>
<td>101 – 104</td>
<td><span className="schedule-tag">Sin referencia</span></td>
</tr>
<tr data-categoria="familiar" hidden={!m.schedule("Pediatría")}>
<td>Pediatría</td>
<td>Lunes a viernes</td>
<td>8:00 a.m. – 2:00 p.m.</td>
<td>205</td>
<td><span className="schedule-tag">Sin referencia</span></td>
</tr>
<tr data-categoria="familiar" hidden={!m.schedule("Ginecología y Obstetricia")}>
<td>Ginecología y Obstetricia</td>
<td>Lunes, miércoles y viernes</td>
<td>8:00 a.m. – 1:00 p.m.</td>
<td>210</td>
<td><span className="schedule-tag">Con SIS</span></td>
</tr>
<tr data-categoria="especializada" hidden={!m.schedule("Cardiología")}>
<td>Cardiología</td>
<td>Martes y jueves</td>
<td>9:00 a.m. – 1:00 p.m.</td>
<td>301</td>
<td><span className="schedule-tag">Con referencia</span></td>
</tr>
<tr data-categoria="especializada" hidden={!m.schedule("Traumatología")}>
<td>Traumatología</td>
<td>Lunes a viernes</td>
<td>2:00 p.m. – 6:00 p.m.</td>
<td>108</td>
<td><span className="schedule-tag">Con referencia</span></td>
</tr>
<tr data-categoria="especializada" hidden={!m.schedule("Cirugía General")}>
<td>Cirugía General</td>
<td>Lunes y miércoles</td>
<td>8:00 a.m. – 12:00 p.m.</td>
<td>305</td>
<td><span className="schedule-tag">Con referencia</span></td>
</tr>
<tr data-categoria="especializada" hidden={!m.schedule("Medicina Interna")}>
<td>Medicina Interna</td>
<td>Martes a viernes</td>
<td>8:00 a.m. – 1:00 p.m.</td>
<td>303</td>
<td><span className="schedule-tag">Con referencia</span></td>
</tr>
<tr data-categoria="especializada" hidden={!m.schedule("Oftalmología")}>
<td>Oftalmología</td>
<td>Miércoles y viernes</td>
<td>9:00 a.m. – 1:00 p.m.</td>
<td>207</td>
<td><span className="schedule-tag">Sin referencia</span></td>
</tr>
<tr data-categoria="bienestar" hidden={!m.schedule("Odontología")}>
<td>Odontología</td>
<td>Lunes a sábado</td>
<td>8:00 a.m. – 4:00 p.m.</td>
<td>Módulo dental</td>
<td><span className="schedule-tag">Sin referencia</span></td>
</tr>
<tr data-categoria="bienestar" hidden={!m.schedule("Psicología")}>
<td>Psicología</td>
<td>Martes, jueves y sábado</td>
<td>9:00 a.m. – 1:00 p.m.</td>
<td>212</td>
<td><span className="schedule-tag">Sin referencia</span></td>
</tr>
<tr data-categoria="emergencia" hidden={!m.schedule("Emergencia")}>
<td>Emergencia</td>
<td>Todos los días</td>
<td data-status="emergencia">24 horas</td>
<td>Ingreso de Emergencia</td>
<td><span className="schedule-tag" data-tag="emergencia">24 horas</span></td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
<section className="section">
<div className="container">
<div className="section-head">
<h2>¿Ya elegiste tu especialidad?</h2>
<p>El siguiente paso es revisar los requisitos según tu forma de pago, y luego completar el formulario de solicitud de cita.</p>
</div>
<div className="hero-actions">
<Link className="btn btn-primary" to="/como-funciona">Ver requisitos</Link>
<Link className="btn btn-outline" to="/registro">Ir directo al formulario</Link>
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
