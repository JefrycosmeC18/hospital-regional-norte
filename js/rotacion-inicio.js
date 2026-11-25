/* Movimiento discreto de las tarjetas de la portada.
   No altera su contenido ni los enlaces del Hospital. */
(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches) return;

  function iniciarRotacion(id, selector, segundos) {
    const grupo = document.getElementById(id);
    const control = document.querySelector('[data-motion-target="' + id + '"]');
    if (!grupo || !control) return;
    if (grupo.querySelectorAll(':scope > ' + selector).length < 2) return;

    let detenido = false;
    let enPantalla = !('IntersectionObserver' in window);
    let enMovimiento = false;

    if ('IntersectionObserver' in window) {
      const observador = new IntersectionObserver((entradas) => {
        enPantalla = entradas.some((entrada) => entrada.isIntersecting);
      }, { threshold: 0.08 });
      observador.observe(grupo);
    }

    control.hidden = false;
    control.addEventListener('click', () => {
      detenido = !detenido;
      control.setAttribute('aria-pressed', String(detenido));
      control.innerHTML = detenido
        ? '<span class="motion-toggle-symbol" aria-hidden="true">▶</span> Reanudar movimiento'
        : '<span class="motion-toggle-symbol" aria-hidden="true">Ⅱ</span> Pausar movimiento';
    });

    function rotar() {
      // Se pausa al interactuar con el contenido, cuando la pestaña no
      // está visible y para quienes solicitan menos movimiento.
      if (detenido || media.matches || document.hidden || !enPantalla || enMovimiento) return;
      if (grupo.matches(':hover') || grupo.contains(document.activeElement)) return;
      const items = Array.from(grupo.children);
      if (items.length < 2) return;

      const posiciones = new Map(items.map(item => [item, item.getBoundingClientRect()]));
      // Un solo elemento pasa al final. Su siguiente posición se calcula
      // a partir del orden real del grid (también en móvil).
      grupo.appendChild(items[0]);

      if (typeof Element.prototype.animate !== 'function') return;
      enMovimiento = true;
      const animaciones = [];
      for (const item of items) {
        const antes = posiciones.get(item);
        const despues = item.getBoundingClientRect();
        const x = antes.left - despues.left;
        const y = antes.top - despues.top;
        if (Math.abs(x) < 1 && Math.abs(y) < 1) continue;
        const animacion = item.animate(
          [
            { transform: 'translate(' + x + 'px,' + y + 'px)' },
            { transform: 'translate(0px,0px)' }
          ],
          { duration: 800, easing: 'cubic-bezier(.22,.78,.22,1)' }
        );
        animaciones.push(animacion.finished.catch(() => {}));
      }
      Promise.all(animaciones).then(() => { enMovimiento = false; });
    }

    window.setInterval(rotar, segundos * 1000);
  }

  iniciarRotacion('datos-destacados', 'dl', 7);
  iniciarRotacion('tarjetas-destacadas', 'li', 9);
})();
