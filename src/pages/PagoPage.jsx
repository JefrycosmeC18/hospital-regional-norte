import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {usePago} from '../hooks/usePago';
export default function PagoPage() {
  const m=usePago();
  return <Page name="pago" title="Pagar cita — Hospital Regional del Norte">

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
<li hidden={!!m.user && m.user.rol!=="cliente"}><Link aria-current="page" to="/pago">Pagar</Link></li>

</ul>
</nav>
<HeaderTools /></div>
</header>
<main><Feedback error={m.error} loading={false} />
<section className="section">
<div className="container">
<div className="section-head">
<h1>Pago en línea</h1>
<p>Paga el ticket de tu cita con tarjeta o con billetera electrónica. Si tu cita está exonerada por SIS, no necesitas pagar.</p>
</div>
<p id="mensaje-pago" className="mensaje" role="status" aria-live="polite">{m.content["mensaje-pago"]}</p>
<div id="bloque-pago" className="pago-layout" {...m.props["bloque-pago"]}>

<div className="pago-principal">
<section className="pago-resumen" aria-labelledby="t-resumen">
<h2 id="t-resumen">Resumen</h2>
<label htmlFor="registro">Cita a pagar</label>
<select id="registro" name="registro" {...m.props["registro"]}>{m.content["registro"]}</select>
<p className="pago-total">Total a pagar: <strong id="resumen-monto">{m.content["resumen-monto"]}</strong></p>
</section>
<fieldset className="pago-metodo">
<legend>Método de pago</legend>
<label><input type="radio" name="metodo" value="tarjeta" {...m.radio("metodo","tarjeta")} /> Tarjeta de débito o crédito</label>
<label><input type="radio" name="metodo" value="billetera" {...m.radio("metodo","billetera")} /> Billetera electrónica</label>
</fieldset>
<form id="form-tarjeta" className="form-card" {...m.props["form-tarjeta"]}>
<div className="field">
<label htmlFor="numero">Número de tarjeta</label>
<input id="numero" name="numero" inputMode="numeric" autoComplete="cc-number" maxLength="19" required={true} aria-describedby="marca-detectada error-numero" {...m.props["numero"]} />
<span id="marca-detectada" className="marca-detectada">{m.content["marca-detectada"]}</span>
<span id="error-numero" className="error">{m.content["error-numero"]}</span>
</div>
<div className="field">
<label htmlFor="vencimiento">Vencimiento (MM/AA)</label>
<input id="vencimiento" name="vencimiento" inputMode="numeric" autoComplete="cc-exp" maxLength="5" placeholder="MM/AA" required={true} aria-describedby="error-vencimiento" {...m.props["vencimiento"]} />
<span id="error-vencimiento" className="error">{m.content["error-vencimiento"]}</span>
</div>
<div className="field">
<label htmlFor="cvv">CVV</label>
<input id="cvv" name="cvv" type="password" inputMode="numeric" autoComplete="cc-csc" maxLength="4" required={true} aria-describedby="error-cvv" {...m.props["cvv"]} />
<span id="error-cvv" className="error">{m.content["error-cvv"]}</span>
</div>
<div className="field">
<label htmlFor="titular">Nombre del titular</label>
<input id="titular" name="titular" autoComplete="cc-name" required={true} aria-describedby="error-titular" {...m.props["titular"]} />
<span id="error-titular" className="error">{m.content["error-titular"]}</span>
</div>
<button type="submit" className={`btn btn-primary ${m.busy?'is-loading':''}`} disabled={m.busy}>{m.busy?'Procesando…':'Pagar con tarjeta'}</button>
</form>
<form id="form-billetera" className="form-card" {...m.props["form-billetera"]}>
<div className="field">
<label htmlFor="proveedor">Billetera</label>
<select id="proveedor" name="proveedor" {...m.props["proveedor"]}>
<option value="andipay">AndiPay</option>
<option value="pagomovil">PagoMóvil</option>
</select>
</div>
<div className="field">
<label htmlFor="celular">Celular afiliado</label>
<input id="celular" name="celular" inputMode="numeric" autoComplete="tel-national" maxLength="9" required={true} aria-describedby="error-celular" {...m.props["celular"]} />
<span id="error-celular" className="error">{m.content["error-celular"]}</span>
</div>
<div className="field">
<label htmlFor="codigo">Código de aprobación (6 dígitos que muestra tu billetera)</label>
<input id="codigo" name="codigo" inputMode="numeric" autoComplete="one-time-code" maxLength="6" required={true} aria-describedby="error-codigo" {...m.props["codigo"]} />
<span id="error-codigo" className="error">{m.content["error-codigo"]}</span>
</div>
<button type="submit" className={`btn btn-primary ${m.busy?'is-loading':''}`} disabled={m.busy}>{m.busy?'Procesando…':'Pagar con billetera'}</button>
</form>
</div>

<aside className="pago-lateral" aria-label="Información del pago">

<div id="tarjeta-visual" data-marca="" aria-hidden="true" {...m.props["tarjeta-visual"]}>
<div className="tarjeta-giro">
<div className="cara frente">
<div className="fila-sup"><span>Entidad de pruebas</span><span className="marca-txt" id="tv-marca">{m.content["tv-marca"]}</span></div>
<span className="chip-emv"></span>
<div className="numero" id="tv-numero">{m.content["tv-numero"]}</div>
<div className="fila-inf">
<span><small>Titular</small><span id="tv-titular">{m.content["tv-titular"]}</span></span>
<span><small>Vence</small><span id="tv-venc">{m.content["tv-venc"]}</span></span>
</div>
</div>
<div className="cara dorso">
<div className="banda"></div>
<div className="firma"><span id="tv-cvv">{m.content["tv-cvv"]}</span></div>
</div>
</div>
</div>
<section className="pago-ticket" aria-labelledby="t-ticket">
<h2 id="t-ticket">Tu ticket</h2>
<dl>
<dt>Cita</dt><dd id="lat-codigo">{m.content["lat-codigo"]}</dd>
<dt>Medio de pago</dt><dd id="lat-medio">{m.content["lat-medio"]}</dd>
<dt>Total</dt><dd id="lat-total" className="pago-ticket-total">{m.content["lat-total"]}</dd>
</dl>
</section>
<section className="pago-aceptamos" aria-labelledby="t-aceptamos">
<h2 id="t-aceptamos">Medios aceptados</h2>
<ul>
<li>Visa</li>
<li>Mastercard</li>
<li>American Express</li>
<li>AndiPay</li>
<li>PagoMóvil</li>
</ul>
</section>
<section className="pago-pasos-caja" aria-labelledby="t-pasos">
<h2 id="t-pasos">Cómo funciona</h2>
<ol className="pago-pasos">
<li>Elige la cita que vas a pagar.</li>
<li>Escoge tarjeta o billetera y completa tus datos.</li>
<li>Recibe tu comprobante y preséntalo en admisión.</li>
</ol>
</section>
</aside>
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
