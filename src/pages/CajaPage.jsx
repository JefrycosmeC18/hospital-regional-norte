import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useCaja} from '../hooks/useCaja';
export default function CajaPage() {
  const m=useCaja();
  return <Page name="caja" title="Caja — Hospital Regional del Norte">

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
<li className="nav-link-panel" hidden={!m.user || !["administrador","empleado"].includes(m.user.rol)} style={{display:m.user && ["administrador","empleado"].includes(m.user.rol)?"list-item":undefined}}><Link to="/panel">Panel</Link></li>
<li hidden={!m.user || !["administrador","cajero"].includes(m.user.rol)}><Link aria-current="page" to="/caja">Caja</Link></li>

</ul>
</nav>
<HeaderTools /></div>
</header>
<main><Feedback error={m.error} loading={false} />
<section className="section">
<div className="container">
<div className="section-head">
<h1>Módulo de Caja</h1>
<p>Cobra en ventanilla el ticket de una cita pendiente y verifica los pagos que llegaron por la pasarela.</p>
<p className="caja-sesion">Caja — <span id="nombre-cajero">{m.content["nombre-cajero"]}</span></p>
</div>
<section className="caja-bloque" aria-labelledby="t-cobro">
<h2 id="t-cobro">Cobro presencial</h2>
<form id="form-buscar" className="caja-buscar" role="search" {...m.props["form-buscar"]}>
<label htmlFor="criterio">Código de seguimiento, DNI o nombre</label>
<input id="criterio" name="criterio" type="search" autoComplete="off" {...m.props["criterio"]} />
<button type="submit" className="btn btn-primary" disabled={m.busy}>Buscar</button>
</form>
<div className="caja-tabla-wrap">
<table id="tabla-pendientes" className="caja-tabla">
<caption>Citas pendientes de pago</caption>
<thead>
<tr><th scope="col">Código</th><th scope="col">Paciente</th><th scope="col">DNI</th>
<th scope="col">Monto</th><th scope="col">Acción</th></tr>
</thead>
<tbody>{m.content["tabla-pendientes"]}</tbody>
</table>
</div>
</section>
<section className="caja-bloque" aria-labelledby="t-linea">
<h2 id="t-linea">Pagos recibidos por la pasarela</h2>
<p id="aviso-nuevos" className="aviso-nuevos" role="status" aria-live="polite">{m.content["aviso-nuevos"]}</p>
<div className="caja-filtros">
<label htmlFor="fecha-caja">Fecha</label>
<input id="fecha-caja" type="date" {...m.props["fecha-caja"]} />
<label className="caja-check"><input id="solo-por-verificar" type="checkbox" {...m.props["solo-por-verificar"]} /> Solo pendientes de verificar</label>
</div>
<div className="caja-tabla-wrap">
<table id="tabla-en-linea" className="caja-tabla">
<caption>Operaciones en línea (se actualizan cada 15 segundos)</caption>
<thead>
<tr><th scope="col">Hora</th><th scope="col">Operación</th><th scope="col">Cita</th>
<th scope="col">Paciente</th><th scope="col">Medio</th><th scope="col">Monto</th>
<th scope="col">Resultado</th><th scope="col">Verificación</th></tr>
</thead>
<tbody>{m.content["tabla-en-linea"]}</tbody>
</table>
</div>
</section>
<section className="caja-bloque" aria-labelledby="t-resumen">
<h2 id="t-resumen">Resumen del día (cierre de caja)</h2>
<div className="caja-tabla-wrap">
<table id="tabla-resumen" className="caja-tabla">
<thead>
<tr><th scope="col">Canal</th><th scope="col">Medio</th>
<th scope="col">Operaciones</th><th scope="col">Total</th></tr>
</thead>
<tbody>{m.content["tabla-resumen"]}</tbody>
</table>
</div>
<p className="caja-total">Total recaudado: <strong id="total-dia">{m.content["total-dia"]}</strong></p>
</section>
</div>
</section>
<dialog id="dialogo-cobro" className="dialogo-cobro" aria-labelledby="t-dialogo" {...m.props["dialogo-cobro"]}>
<form id="form-cobro" {...m.props["form-cobro"]}>
<h2 id="t-dialogo">Registrar cobro</h2><Feedback error={m.dialogError} />
<p>Cita <strong id="cobro-codigo">{m.content["cobro-codigo"]}</strong> — Total <strong id="cobro-total">{m.content["cobro-total"]}</strong></p>
<div className="field">
<label htmlFor="metodo-caja">Medio de pago</label>
<select id="metodo-caja" name="metodo" {...m.props["metodo-caja"]}>
<option value="efectivo">Efectivo</option>
<option value="pos">Tarjeta en POS</option>
<option value="andipay">Billetera AndiPay (QR)</option>
<option value="pagomovil">Billetera PagoMóvil (QR)</option>
</select>
</div>
<div id="campo-recibido" className="field" {...m.props["campo-recibido"]}>
<label htmlFor="monto-recibido">Monto recibido (S/)</label>
<input id="monto-recibido" name="monto_recibido" type="number" min="0" step="0.01" {...m.props["monto-recibido"]} />
<p>Vuelto: <output id="vuelto">{m.content["vuelto"]}</output></p>
</div>
<div id="campo-referencia" className="field" {...m.props["campo-referencia"]}>
<label htmlFor="referencia">N.° de voucher u operación</label>
<input id="referencia" name="referencia" inputMode="numeric" maxLength="12" {...m.props["referencia"]} />
</div>
<p id="cobro-resumen" className="cobro-resumen" {...m.props["cobro-resumen"]}>{m.content["cobro-resumen"]}</p>
<div className="dialogo-acciones">
<button type="submit" id="btn-revisar" className="btn btn-primary" {...m.props["btn-revisar"]} disabled={m.busy}>Revisar cobro</button>
<button type="button" id="btn-confirmar" className={`btn btn-accent ${m.busy?'is-loading':''}`} {...m.props["btn-confirmar"]}>Sí, cobrar</button>
<button type="button" id="btn-volver" className="btn btn-outline" {...m.props["btn-volver"]}>Volver</button>
<button type="button" id="cancelar-cobro" className="btn btn-outline" {...m.props["cancelar-cobro"]}>Cancelar</button>
</div>
</form>
</dialog>
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
