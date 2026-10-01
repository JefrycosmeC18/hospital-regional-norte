// js/auth/login.js
// Script propio de login.html: pestañas Iniciar sesión / Registrar cuenta
// (controladas por el hash de la URL) y llamadas a auth.js.
// Semana 7: tras iniciar sesión, redirige según el rol del usuario.

import { iniciarSesion, registrarUsuario } from './auth.js';

// --- LÓGICA DE PESTAÑAS Y URL HASH ---
function mostrarApartado() {
  const hash = window.location.hash || '#iniciar'; // Por defecto muestra iniciar sesión

  const secIniciar = document.getElementById('seccionIniciar');
  const secRegistrar = document.getElementById('seccionRegistrar');
  const tabIniciar = document.getElementById('tabIniciar');
  const tabRegistrar = document.getElementById('tabRegistrar');

  if (hash === '#registrar') {
    secIniciar.classList.remove('active');
    secRegistrar.classList.add('active');
    tabIniciar.classList.remove('active');
    tabRegistrar.classList.add('active');
  } else {
    secIniciar.classList.add('active');
    secRegistrar.classList.remove('active');
    tabIniciar.classList.add('active');
    tabRegistrar.classList.remove('active');
  }
}

window.addEventListener('hashchange', mostrarApartado);
mostrarApartado(); // Ejecutar al cargar la página

// --- LÓGICA DE AUTENTICACIÓN ---
const formLogin = document.getElementById('formLogin');
const formRegister = document.getElementById('formRegister');
const msgLogin = document.getElementById('msgLogin');
const msgRegister = document.getElementById('msgRegister');

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgLogin.textContent = 'Verificando datos...';

  const correo = document.getElementById('loginCorreo').value.trim();
  const pass = document.getElementById('loginPass').value.trim();

  const res = await iniciarSesion(correo, pass);
  if (res.exito) {
    // RF: redirige según el rol — cliente a su formulario, admin/empleado al panel.
    if (res.usuario.rol === 'cliente') {
      window.location.href = 'registro.html';
    } else {
      window.location.href = 'panel.html';
    }
  } else {
    msgLogin.textContent = res.mensaje;
  }
});

formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgRegister.style.color = '#0F5D52';
  msgRegister.textContent = 'Registrando cuenta...';

  const nombre = document.getElementById('regNombre').value.trim();
  const correo = document.getElementById('regCorreo').value.trim();
  const pass = document.getElementById('regPass').value.trim();

  const res = await registrarUsuario(nombre, correo, pass);
  if (res.exito) {
    msgRegister.textContent = '¡Cuenta creada! Redirigiendo al inicio de sesión...';
    formRegister.reset();
    setTimeout(() => {
      window.location.hash = '#iniciar';
    }, 1500);
  } else {
    msgRegister.style.color = '#b30000';
    msgRegister.textContent = res.mensaje;
  }
});
