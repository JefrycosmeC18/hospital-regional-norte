import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useLogin} from '../hooks/useLogin';
export default function LoginPage() {
  const m=useLogin();
  return <Page name="login" title="Acceso de Pacientes — Hospital Regional del Norte">
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
<nav className="main-nav">
<ul>
<li><Link to="/">Inicio</Link></li>
<li><Link to="/servicios">Especialidades</Link></li>
</ul>
</nav>
<HeaderTools /></div>
</header>
<main>
<section className="section">
<div className="container">
<div className="section-head">
<h1>Acceso al Portal de Citas</h1>
<p>Inicia sesión o crea una cuenta para gestionar tus citas médicas en la plataforma.</p>
</div>
<div className="tabs">
<Link to="/login#iniciar" id="tabIniciar" {...m.props["tabIniciar"]}>Iniciar Sesión</Link>
<Link to="/login#registrar" id="tabRegistrar" {...m.props["tabRegistrar"]}>Registrar Nueva Cuenta</Link>
</div>
<div>

<div id="seccionIniciar" {...m.props["seccionIniciar"]}>
<form className="form-card" id="formLogin" {...m.props["formLogin"]}>
<fieldset>
<legend>Iniciar Sesión</legend>
<div id="msgLogin" className="hint login-feedback login-feedback-error">{m.content["msgLogin"]}</div>
<div className="field">
<label htmlFor="loginCorreo">Correo electrónico</label>
<input type="email" id="loginCorreo" required={true} placeholder="tucorreo@ejemplo.com" {...m.props["loginCorreo"]} />
</div>
<div className="field">
<label htmlFor="loginPass">Contraseña</label>
<div className="password-wrapper">
<input type="password" id="loginPass" required={true} placeholder="••••••••" {...m.props["loginPass"]} />
</div>
</div>
<button type="submit" className="btn btn-primary login-submit" disabled={m.busy}>Ingresar al sistema</button>
</fieldset>
</form>
</div>

<div id="seccionRegistrar" {...m.props["seccionRegistrar"]}>
<form className="form-card" id="formRegister" {...m.props["formRegister"]}>
<fieldset>
<legend>Registrar Nueva Cuenta</legend>
<div id="msgRegister" className="hint login-feedback">{m.content["msgRegister"]}</div>
<div className="field">
<label htmlFor="regNombre">Nombres y Apellidos</label>
<input type="text" id="regNombre" required={true} placeholder="Como figura en tu DNI" {...m.props["regNombre"]} />
</div>
<div className="field">
<label htmlFor="regCorreo">Correo electrónico</label>
<input type="email" id="regCorreo" required={true} placeholder="tucorreo@ejemplo.com" {...m.props["regCorreo"]} />
</div>
<div className="field">
<label htmlFor="regPass">Contraseña</label>
<div className="password-wrapper">
<input type="password" id="regPass" required={true} placeholder="Mínimo 6 caracteres" {...m.props["regPass"]} />
</div>
</div>
<button type="submit" className="btn btn-outline login-submit" disabled={m.busy}>Crear mi cuenta</button>
</fieldset>
</form>
</div>
</div>
</div>
</section>
</main>
<footer className="site-footer">
<div className="container">
<div>
<h4>Hospital Regional del Norte</h4>
<p>Acceso de pacientes y personal autorizado.</p>
</div>
</div>
</footer>

<div className="loader-overlay" id="loaderOverlay" role="status" aria-live="polite" {...m.props["loaderOverlay"]}>
<div className="loader-box">
<div className="loader-icon">
<svg className="loader-cross" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
<circle cx="24" cy="24" r="22" fill="#0F5D52"></circle>
<path d="M24 12v24M12 24h24" stroke="#F2F5F1" strokeWidth="5" strokeLinecap="round"></path>
</svg>
<svg className="loader-check" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
<circle cx="24" cy="24" r="22" fill="#0F5D52"></circle>
<path d="M14 25l7 7 13-14" pathLength="1" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
</div>
<p className="loader-text" id="loaderText">{m.content["loaderText"]}</p>
</div>
</div>



</Page>;
}
