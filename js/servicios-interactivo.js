/* Filtro accesible de especialidades y tabla de horarios de prueba. */
(() => {
  const buscador = document.querySelector("#buscador-especialidades");
  const categoria = document.querySelector("#categoria-especialidades");
  const limpiar = document.querySelector("#limpiar-especialidades");
  const tarjetas = [...document.querySelectorAll(".service-detail-card")];
  const filas = [...document.querySelectorAll(".schedule-table tbody tr")];
  const total = document.querySelector("#resultados-especialidades");
  const vacio = document.querySelector("#sin-resultados-especialidades");
  if (!buscador || !categoria || !limpiar || !total || !vacio) return;
  const normalizar = (valor) => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  function aplicarFiltros() {
    const texto = normalizar(buscador.value);
    const tipo = categoria.value;
    let visibles = 0;
    for (const tarjeta of tarjetas) {
      const coincide = (tipo === "todas" || tarjeta.dataset.categoria === tipo) && normalizar(tarjeta.textContent).includes(texto);
      tarjeta.hidden = !coincide;
      if (coincide) visibles++;
    }
    const nombresVisibles = new Set(tarjetas.filter(tarjeta => !tarjeta.hidden).map(tarjeta => normalizar(tarjeta.querySelector("h3").textContent)));
    for (const fila of filas) {
      const nombre = normalizar(fila.cells[0].textContent);
      fila.hidden = !nombresVisibles.has(nombre);
    }
    vacio.hidden = visibles !== 0;
    total.textContent = `Se muestran ${visibles} de ${tarjetas.length} servicios.`;
  }
  buscador.addEventListener("input", aplicarFiltros);
  categoria.addEventListener("change", aplicarFiltros);
  limpiar.addEventListener("click", () => {
    buscador.value = "";
    categoria.value = "todas";
    aplicarFiltros();
    buscador.focus();
  });
  aplicarFiltros();
})();
