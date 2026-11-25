/* Cintas continuas de derecha a izquierda para el inicio del Hospital. */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function crearTren(id, segundos) {
    const pista = document.getElementById(id);
    if (!pista || pista.querySelectorAll(':scope > .train-set').length > 1) return;
    let grupo = pista.querySelector(':scope > .train-set');
    const cantidad = grupo ? grupo.children.length : pista.children.length;
    if (cantidad < 2) return;
    if (!grupo) {
      grupo = document.createElement('div');
      grupo.className = 'train-set';
      while (pista.firstChild) grupo.appendChild(pista.firstChild);
    }
    const copia = grupo.cloneNode(true);
    copia.setAttribute('aria-hidden','true');
    copia.inert = true;
    pista.append(grupo, copia);
    pista.style.setProperty('--train-duration', segundos + 's');
    pista.classList.add('is-moving');
  }
  crearTren('datos-destacados', 28);
  crearTren('tarjetas-destacadas', 36);
})();