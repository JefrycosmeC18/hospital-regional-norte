import React from 'react';
import {Link} from 'react-router-dom';
import {Page,HeaderTools,Train,Options,Feedback} from '../components/Common';
import {useStatic} from '../hooks/useStatic';
export default function ActualidadPage() {
  const m=useStatic();
  return <Page name="actualidad" title="Actualidad — Hospital Regional del Norte">
<header className="site-header"><div className="container"><Link className="brand" to="/"><svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
<circle cx="24" cy="24" r="22" fill="#0F5D52"></circle>
<path d="M24 12v24M12 24h24" stroke="#F2F5F1" strokeWidth="5" strokeLinecap="round"></path>
<circle cx="24" cy="24" r="22" fill="none" stroke="#E0762E" strokeWidth="2"></circle>
</svg><span className="brand-text"><strong className="name">Hospital Regional del Norte</strong><span className="tagline">Piura</span></span></Link><input className="nav-toggle" id="nav-toggle" type="checkbox" checked={m.menu} onChange={e=>m.setMenu(e.target.checked)} /><label className="nav-toggle-label" htmlFor="nav-toggle" aria-label="Abrir menú"><span></span><span></span><span></span></label><nav className="main-nav" aria-label="Navegación"><ul><li><Link to="/">Inicio</Link></li><li><Link to="/institucion">Institución</Link></li><li><Link to="/servicios">Especialidades</Link></li><li><Link aria-current="page" to="/actualidad">Actualidad</Link></li><li hidden={!!m.user && m.user.rol!=="cliente"}><Link to="/registro">Citas</Link></li><li><Link to="/contacto">Contacto</Link></li></ul></nav><HeaderTools /></div></header>
<main><section className="section pagina-portada-institucional"><div className="container"><p className="info-kicker">Información para la comunidad</p><h1>Actualidad y guías del portal</h1><p>Recursos de orientación y novedades de los servicios digitales.</p></div></section><section className="section"><div className="container"><div className="novedades-grid">
<article><span>GUÍA</span><h2>Cómo registrar una solicitud de atención</h2><p>Conoce los datos que solicita el formulario, las validaciones y el seguimiento posterior.</p><Link to="/como-funciona">Leer guía →</Link></article>
<article><span>SERVICIOS</span><h2>Conoce las especialidades</h2><p>Consulta las áreas y la información orientativa de cada una.</p><Link to="/servicios">Explorar servicios →</Link></article>
<article><span>SERVICIOS DIGITALES</span><h2>Nuevo seguimiento de citas</h2><p>Las tarjetas de Mis citas incluyen estado, información de pago y una ruta de atención.</p><Link to="/consulta">Ver Mis citas →</Link></article>
<article><span>ACCESIBILIDAD</span><h2>Un portal más fácil de leer</h2><p>El Modo fácil permite aumentar tamaño de texto y mejorar contraste en las páginas del portal.</p><Link to="/institucion#servicios-digitales">Más información →</Link></article>
<article><span>GESTIÓN</span><h2>Panel de calendario y reportes</h2><p>Las cuentas administrativas pueden consultar citas, aplicar filtros y revisar indicadores agregados.</p><Link to="/login#iniciar">Iniciar sesión →</Link></article>
<article><span>ORIENTACIÓN</span><h2>Requisitos generales y canales oficiales</h2><p>Consulta los pasos para solicitar atención y los canales de información del MINSA y SIS.</p><Link to="/contacto">Orientación →</Link></article>
</div></div></section></main>
<footer className="site-footer"><div className="container"><div><h4>Hospital Regional del Norte</h4><p>Información, servicios y orientación al paciente.</p></div><div><h4>Explora</h4><p><Link to="/">Inicio</Link> · <Link to="/institucion">Institución</Link></p></div><div><h4>Ayuda</h4><p><Link to="/contacto">Contacto</Link></p></div></div></footer>
</Page>;
}

