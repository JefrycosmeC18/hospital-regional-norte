/* Perfil compartido en todas las páginas. Usa la sesión existente del portal. */
(() => {
  let usuario = null;
  try {
    usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');
  } catch (_) {
    usuario = null;
  }
  if (!usuario || !usuario.nombre || !usuario.rol) return;

  const encabezado = document.querySelector('.site-header .container');
  if (!encabezado || encabezado.querySelector('.header-profile')) return;

  const rutas = {
    cliente: { texto: 'Mis citas', href: 'consulta.html' },
    administrador: { texto: 'Panel de gestión', href: 'panel.html' },
    empleado: { texto: 'Panel de gestión', href: 'panel.html' },
    cajero: { texto: 'Área de caja', href: 'caja.html' }
  };
  const nombresRol = {
    cliente: 'Paciente',
    administrador: 'Administrador',
    empleado: 'Empleado',
    cajero: 'Cajero'
  };
  const destino = rutas[usuario.rol] || { texto: 'Inicio', href: 'index.html' };
  const rol = nombresRol[usuario.rol] || 'Usuario';
  const nombre = String(usuario.nombre).trim() || 'Usuario';
  const nombreCorto = nombre.split(/\s+/)[0] || 'Usuario';

  // Se conserva el enlace de cierre original oculto para no romper
  // los eventos existentes de registro, panel, caja y pagos.
  for (const item of document.querySelectorAll('.main-nav li')) {
    const enlace = item.querySelector('a');
    if (!enlace) continue;
    const href = enlace.getAttribute('href') || '';
    if (
      enlace.id === 'btnCerrarSesion' ||
      href.split('#')[0] === 'login.html' ||
      item.classList.contains('nav-link-login') ||
      item.classList.contains('nav-link-register') ||
      item.classList.contains('nav-link-panel')
    ) {
      item.hidden = true;
    }
  }

  const perfil = document.createElement('div');
  perfil.className = 'header-profile';

  const abrir = document.createElement('button');
  abrir.type = 'button';
  abrir.className = 'header-profile-trigger';
  abrir.setAttribute('aria-expanded','false');
  abrir.setAttribute('aria-haspopup','true');
  abrir.setAttribute('aria-label', 'Perfil de ' + nombre);
  // El SVG es fijo. El nombre del usuario se inserta mediante textContent.
  abrir.innerHTML = '<span class="header-profile-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg></span><span class="header-profile-text"><strong class="header-profile-name"></strong><small class="header-profile-role"></small></span><span class="header-profile-chevron" aria-hidden="true">⌄</span>';
  abrir.querySelector('.header-profile-name').textContent = nombreCorto;
  abrir.querySelector('.header-profile-role').textContent = rol;

  const menu = document.createElement('div');
  menu.className = 'header-profile-menu';
  menu.hidden = true;

  const identidad = document.createElement('div');
  identidad.className = 'header-profile-identity';
  const completo = document.createElement('strong');
  completo.textContent = nombre;
  const descripcion = document.createElement('small');
  descripcion.textContent = rol;
  identidad.append(completo, descripcion);

  const espacio = document.createElement('a');
  espacio.href = destino.href;
  espacio.textContent = destino.texto;
  espacio.className = 'header-profile-link';

  const salir = document.createElement('button');
  salir.type = 'button';
  salir.className = 'header-profile-logout';
  salir.textContent = 'Cerrar sesión';
  salir.addEventListener('click', () => {
    sessionStorage.removeItem('usuario');
    window.location.assign('login.html#iniciar');
  });

  menu.append(identidad, espacio, salir);
  perfil.append(abrir, menu);
  encabezado.append(perfil);

  function mostrar(abierto) {
    menu.hidden = !abierto;
    abrir.setAttribute('aria-expanded', String(abierto));
  }
  abrir.addEventListener('click', () => mostrar(menu.hidden));
  document.addEventListener('click', e => {
    if (!perfil.contains(e.target)) mostrar(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) {
      mostrar(false);
      abrir.focus();
    }
  });
})();