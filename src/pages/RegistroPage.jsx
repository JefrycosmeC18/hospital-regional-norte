import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useRegistro} from '../hooks/useRegistro';
export default function RegistroPage() {
  const m=useRegistro();
  return <Page name="registro" title="Solicitar cita — Hospital Regional del Norte">
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
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link aria-current="page" to="/registro">Solicitar cita</Link></li>
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/consulta">Mis citas</Link></li>
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
<h1>Solicitud de cita médica</h1>
<p>Completa tus datos, selecciona una especialidad y guarda el código de seguimiento de tu solicitud.</p>
</div>
<div className="confirm-box" id="confirmBox" {...m.props["confirmBox"]}>
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
<circle cx="12" cy="12" r="11" fill="#0F5D52"></circle>
<path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
<p id="confirmTexto">{m.content["confirmTexto"]}</p>
</div>
<div className="booking-overview" aria-label="Pasos de la solicitud">
<div className="booking-overview-step" data-activo={m.step===1} data-completo={m.step>1} aria-current={m.step===1?"step":undefined}><span className="booking-step-number">01</span><div><strong>Datos del paciente</strong><small>Identificación y contacto</small></div></div>
<div className="booking-overview-step" data-activo={m.step===2} data-completo={m.step>2} aria-current={m.step===2?"step":undefined}><span className="booking-step-number">02</span><div><strong>Datos de la cita</strong><small>Especialidad y preferencia</small></div></div>
<div className="booking-overview-step" data-activo={m.step===3} data-completo={m.step>3} aria-current={m.step===3?"step":undefined}><span className="booking-step-number">03</span><div><strong>Registro y consulta</strong><small>Código para el seguimiento</small></div></div>
</div>
<div className="cita-progreso" role="progressbar" aria-label="Progreso de la solicitud" aria-valuemin="0" aria-valuemax="3" id="citaProgreso" {...m.props["citaProgreso"]}>
<span id="citaProgresoBarra" {...m.props["citaProgresoBarra"]}></span>
</div>
<p className="cita-paso-etiqueta" id="citaPasoEtiqueta" aria-live="polite">{m.content["citaPasoEtiqueta"]}</p>
<p className="booking-safety-note"><strong>Importante:</strong> la fecha solicitada está sujeta a disponibilidad. Consulta tu estado con el código de seguimiento.</p>

<div className="citas-layout">

<form className="form-card" id="citaForm" {...m.props["citaForm"]}>
<fieldset className="cita-etapa" data-paso="1" hidden={m.step!==1}>
<legend>Datos del paciente</legend>
<div className="field">
<label htmlFor="nombre">Nombres y apellidos</label>
<input type="text" id="nombre" name="nombre" placeholder="Como figura en tu DNI" required={true} minLength="4" {...m.props["nombre"]} />
</div>
<div className="field">
<label htmlFor="dni">DNI</label>
<input type="text" id="dni" name="dni" placeholder="8 dígitos" pattern="[0-9]{8}" maxLength="8" required={true} {...m.props["dni"]} />
<span className="hint">Solo números, sin puntos ni espacios.</span>
</div>
<div className="field">
<label htmlFor="fecha-nacimiento">Fecha de nacimiento</label>
<input type="date" id="fecha-nacimiento" name="fecha_nacimiento" required={true} {...m.props["fecha-nacimiento"]} />
</div>
<div className="field">
<label htmlFor="telefono">Teléfono de contacto</label>
<input type="tel" id="telefono" name="telefono" placeholder="9XX XXX XXX" pattern="[0-9]{9}" required={true} {...m.props["telefono"]} />
</div>
<div className="field">
<label htmlFor="correo">Correo electrónico (opcional)</label>
<input type="email" id="correo" name="correo" placeholder="tucorreo@ejemplo.com" {...m.props["correo"]} />
</div>
</fieldset>
<fieldset className="cita-etapa" data-paso="2" hidden={m.step!==2}>
<legend>Datos de la cita</legend>
<div className="field">
<label htmlFor="especialidad">Especialidad</label>
<select id="especialidad" name="especialidad" required={true} {...m.props["especialidad"]}>
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
<span>Forma de pago</span>
<div className="radio-group">
<label><input type="radio" name="pago" value="sis" {...m.radio("pago","sis")} /> SIS</label>
<label><input type="radio" name="pago" value="particular" {...m.radio("pago","particular")} /> Pago particular</label>
</div>
</div>
<div className="field">
<label htmlFor="fecha-preferida">Fecha de preferencia</label>
<input type="date" id="fecha-preferida" name="fecha_preferida" required={true} {...m.props["fecha-preferida"]} />
<span className="hint">Solo se permiten fechas a partir de hoy. Sujeta a disponibilidad de cupos.</span>
</div>
<div className="field">
<label htmlFor="motivo">Motivo de consulta</label>
<textarea id="motivo" name="motivo" placeholder="Cuéntanos brevemente qué síntomas o control necesitas" required={true} {...m.props["motivo"]}></textarea>
</div>
<div className="monto-estimado">
<p>Monto estimado de tu ticket: <output id="monto-estimado" htmlFor="especialidad" aria-live="polite">{m.content["monto-estimado"]}</output></p>
<p className="hint" id="monto-nota">{m.content["monto-nota"]}</p>
</div>
</fieldset>
<section className="cita-etapa cita-confirmacion" data-paso="3" aria-labelledby="confirmacionCitaTitulo" hidden={m.step!==3}>
<h2 id="confirmacionCitaTitulo">Revisa tu solicitud</h2>
<p>Comprueba tus datos antes de enviarlos. La fecha preferida está sujeta a disponibilidad.</p>
<dl className="cita-resumen">
<div><dt>Paciente</dt><dd id="resumenNombre">{m.content["resumenNombre"]}</dd></div>
<div><dt>Especialidad</dt><dd id="resumenEspecialidad">{m.content["resumenEspecialidad"]}</dd></div>
<div><dt>Fecha preferida</dt><dd id="resumenFecha">{m.content["resumenFecha"]}</dd></div>
<div><dt>Forma de pago</dt><dd id="resumenPago">{m.content["resumenPago"]}</dd></div>
<div><dt>Ticket estimado</dt><dd id="resumenMonto">{m.content["resumenMonto"]}</dd></div>
</dl>
<p className="form-footnote">Si necesitas atención inmediata, acude al servicio de emergencias más cercano. Este formulario es para solicitudes de cita programada.</p>
<button type="submit" className="btn btn-primary" disabled={m.busy}>Enviar solicitud de cita</button>
</section>
<div className="cita-pasos-controles">
<button type="button" className="btn btn-outline" id="pasoAnterior" {...m.props["pasoAnterior"]}>Anterior</button>
<button type="button" className="btn btn-primary" id="pasoSiguiente" {...m.props["pasoSiguiente"]}>Continuar</button>
</div>
<p className="cita-validacion-mensaje" id="pasoError" role="alert" {...m.props["pasoError"]}>{m.content["pasoError"]}</p>
</form>

<aside className="info-sidebar">
<h3>Requisitos para tu Cita</h3>
<ul>
<li>Presentar DNI físico vigente al momento de la consulta.</li>
<li>Si cuentas con SIS, verificar que se encuentre activo.</li>
<li>Llegar 20 minutos antes de la hora programada para el triaje.</li>
<li>Presentar carnet de vacunación si es consulta pediátrica.</li>
</ul>
<h3>Horarios de Atención</h3>
<div className="info-card-box">
<strong>Consultorios Externos:</strong>
<p className="registro-texto-secundario">Lunes a Sábado: 07:00 AM - 07:00 PM</p>
</div>
<div className="info-card-box">
<strong>Atención de Emergencias:</strong>
<p className="registro-texto-secundario">Disponible los 365 días del año (24 horas).</p>
</div>
<div className="info-card-box registro-nota-destacada">
<strong>¿Necesitas reprogramar?</strong>
<p className="registro-texto-pie">Ve a <Link to="/consulta">Mis citas</Link> con tu código generado.</p>
</div>
</aside>
</div>
</div>
</section>
<section className="section section--alt" id="misSolicitudes">
<div className="container">
<div className="section-head">
<h2>Tus solicitudes en este navegador</h2>
<p>En este apartado puedes revisar tus solicitudes guardadas en este navegador. Para consultar su estado actualizado, entra a <Link to="/consulta">Mis citas</Link>.</p>
</div>
<ul className="my-requests" id="misSolicitudesLista">{m.content["misSolicitudesLista"]}</ul>
<p className="hint" id="misSolicitudesVacio" {...m.props["misSolicitudesVacio"]}>{m.content["misSolicitudesVacio"]}</p>
<button type="button" className="btn btn-outline" id="borrarSolicitudes" {...m.props["borrarSolicitudes"]}>Vaciar historial local</button>
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
