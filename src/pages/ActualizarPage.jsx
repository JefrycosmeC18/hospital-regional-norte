import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useActualizar} from '../hooks/useActualizar';
export default function ActualizarPage() {
  const m=useActualizar();
  return <Page name="actualizar" title="Editar mi cita — Hospital Regional del Norte">
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
<li><Link to="/contacto">Contacto</Link></li>
<li className="nav-link-panel" hidden={!m.user || !["administrador","empleado"].includes(m.user.rol)} style={{display:m.user && ["administrador","empleado"].includes(m.user.rol)?"list-item":undefined}}><Link to="/panel">Panel</Link></li>

</ul>
</nav>
<HeaderTools /></div>
</header>
<main><Feedback error={m.error} loading={false} />
<section className="section">
<div className="container">
<Link className="volver-link" to="/consulta">← Volver a Mis citas</Link>
<div className="section-head">
<h1>Editar mi solicitud de cita</h1>
<p>Puedes corregir los datos mientras tu cita siga en estado <strong>registrado</strong>.</p>
</div>
<div className="confirm-box" id="confirmBox" {...m.props["confirmBox"]}>
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
<circle cx="12" cy="12" r="11" fill="#0F5D52"></circle>
<path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
<p id="confirmTexto">{m.content["confirmTexto"]}</p>
</div>
<div className="aviso-solo-lectura" id="avisoSoloLectura" {...m.props["avisoSoloLectura"]}>
<span id="avisoTexto">{m.content["avisoTexto"]}</span> Si necesitas un cambio, consulta los <Link to="/contacto">canales de atención</Link>.
        </div>
<form className="form-card" id="actualizarForm" {...m.props["actualizarForm"]}>
<input type="hidden" id="regId" name="id" {...m.props["regId"]} />
<fieldset>
<legend>Datos del paciente</legend>
<div className="field">
<label htmlFor="nombre">Nombres y apellidos</label>
<input type="text" id="nombre" name="nombre" required={true} minLength="4" {...m.props["nombre"]} />
</div>
<div className="field">
<label htmlFor="dni">DNI</label>
<input type="text" id="dni" name="dni" pattern="[0-9]{8}" maxLength="8" required={true} {...m.props["dni"]} />
</div>
</fieldset>
<fieldset>
<legend>Datos de la cita</legend>
<div className="field">
<label htmlFor="especialidad">Especialidad</label>
<select id="especialidad" name="especialidad" required={true} {...m.props["especialidad"]}>
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
<label htmlFor="fecha-preferida">Fecha de preferencia</label>
<input type="date" id="fecha-preferida" name="fecha_preferida" required={true} {...m.props["fecha-preferida"]} />
</div>
<div className="field">
<span>Forma de pago</span>
<div className="radio-group">
<label><input type="radio" name="pago" value="sis" {...m.radio("pago","sis")} /> SIS</label>
<label><input type="radio" name="pago" value="particular" {...m.radio("pago","particular")} /> Pago particular</label>
</div>
</div>
<div className="monto-estimado">
<p>Monto del ticket: <output id="monto-estimado" htmlFor="especialidad" aria-live="polite">{m.content["monto-estimado"]}</output></p>
<p className="hint">Si cambias la especialidad o el SIS, el monto se recalcula.</p>
</div>
</fieldset>
<button type="submit" className="btn btn-primary" disabled={m.busy}>Guardar cambios</button>
</form>
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
