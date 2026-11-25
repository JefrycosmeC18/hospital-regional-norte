/* Modo fácil para todo el portal.
   Preferencias visuales locales; no accede a datos personales ni médicos. */
(() => {
  if (document.getElementById('modoFacilControl')) return;

  const configuracion = { grande: false, contraste: false };
  try {
    const guardado = JSON.parse(localStorage.getItem('hrn_accesibilidad') || '{}');
    configuracion.grande = guardado.grande === true;
    configuracion.contraste = guardado.contraste === true;
  } catch (_) { /* Mantener la configuración predeterminada */ }

  const cabecera = document.querySelector('.site-header .container');
  const encabezado = document.querySelector('.site-header');
  if (!cabecera || !encabezado) return;

  const boton = document.createElement('button');
  boton.id = 'modoFacilControl';
  boton.type = 'button';
  boton.className = 'access-trigger';
  boton.setAttribute('aria-expanded', 'false');
  boton.setAttribute('aria-controls', 'modoFacilOpciones');
  boton.textContent = 'Aa Modo fácil';

  const opciones = document.createElement('section');
  opciones.className = 'access-panel';
  opciones.id = 'modoFacilOpciones';
  opciones.hidden = true;
  opciones.setAttribute('aria-label', 'Preferencias de accesibilidad');

  const titulo = document.createElement('h2');
  titulo.textContent = 'Facilita la lectura';
  const descripcion = document.createElement('p');
  descripcion.textContent = 'Personaliza la presentación del portal. No cambia tus citas ni tus datos.';
  opciones.append(titulo, descripcion);

  function crearOpcion(texto, clave) {
    const fila = document.createElement('label');
    fila.className = 'access-option';
    const casilla = document.createElement('input');
    casilla.type = 'checkbox';
    casilla.checked = configuracion[clave];
    casilla.addEventListener('change', () => {
      configuracion[clave] = casilla.checked;
      aplicar();
      try {
        localStorage.setItem('hrn_accesibilidad', JSON.stringify(configuracion));
      } catch (_) { /* El modo funciona igualmente sin persistencia */ }
    });
    const etiqueta = document.createElement('span');
    etiqueta.textContent = texto;
    fila.append(casilla, etiqueta);
    opciones.append(fila);
  }

  crearOpcion('Letras y botones grandes', 'grande');
  crearOpcion('Contraste mejorado', 'contraste');

  const restaurar = document.createElement('button');
  restaurar.type = 'button';
  restaurar.className = 'access-reset';
  restaurar.textContent = 'Restablecer tamaño y contraste';
  restaurar.addEventListener('click', () => {
    configuracion.grande = false;
    configuracion.contraste = false;
    opciones.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.checked = false;
    });
    aplicar();
    try { localStorage.removeItem('hrn_accesibilidad'); } catch (_) {}
  });
  opciones.append(restaurar);

  function aplicar() {
    document.documentElement.classList.toggle('modo-facil-grande', configuracion.grande);
    document.documentElement.classList.toggle('modo-facil-contraste', configuracion.contraste);
  }

  function mostrar(abierto) {
    opciones.hidden = !abierto;
    boton.setAttribute('aria-expanded', String(abierto));
  }
  boton.addEventListener('click', () => mostrar(opciones.hidden));
  document.addEventListener('click', e => {
    if (!boton.contains(e.target) && !opciones.contains(e.target)) mostrar(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !opciones.hidden) {
      mostrar(false);
      boton.focus();
    }
  });

  // Inserta el acceso antes del perfil unificado cuando exista.
  const perfil = cabecera.querySelector('.header-profile');
  if (perfil) cabecera.insertBefore(boton, perfil);
  else cabecera.append(boton);
  encabezado.append(opciones);
  aplicar();
})();