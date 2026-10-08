// js/nav-rol.js
// Muestra el enlace "Panel" del menú solo si el usuario en sesión
// es administrador o empleado. Para el resto (visitantes y clientes) queda oculto.
const usuarioStr = sessionStorage.getItem('usuario');
if (usuarioStr) {
  try {
    const usuario = JSON.parse(usuarioStr);
    const panelLink = document.querySelector('.nav-link-panel');
    if (panelLink && (usuario.rol === 'administrador' || usuario.rol === 'empleado')) {
      panelLink.style.display = '';
    }
  } catch (e) {}
}
