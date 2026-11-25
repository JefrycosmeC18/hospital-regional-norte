/* Progreso visual de la guía. No almacena ni transmite datos. */
(() => {
  const elementos = [...document.querySelectorAll(".readiness-item")];
  const texto = document.getElementById("progreso-texto");
  const barra = document.getElementById("progreso-barra");
  const relleno = document.getElementById("progreso-relleno");
  const reiniciar = document.getElementById("reiniciar-checklist");
  if (!elementos.length || !texto || !barra || !relleno || !reiniciar) return;
  const actualizar = () => {
    const terminados = elementos.filter(item => item.checked).length;
    texto.textContent = `${terminados} de ${elementos.length} pasos completados`;
    barra.setAttribute("aria-valuenow", String(terminados));
    relleno.style.width = `${100 * terminados / elementos.length}%`;
  };
  elementos.forEach(item => item.addEventListener("change", actualizar));
  reiniciar.addEventListener("click", () => {
    elementos.forEach(item => { item.checked = false; });
    actualizar();
  });
  actualizar();
})();
