// js/auth/login.js
// Script propio de login.html: pestañas Iniciar sesión / Registrar cuenta
// (controladas por el hash de la URL) y llamadas a auth.js.
// Semana 7: tras iniciar sesión, redirige según el rol del usuario.

import { iniciarSesion, registrarUsuario, rutaInicioSegunRol } from './auth.js';

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

// --- PANTALLA DE CARGA (cruz que gira a derecha e izquierda, luego ✓) ---
const loaderOverlay = document.getElementById('loaderOverlay');
const loaderText = document.getElementById('loaderText');
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function mostrarLoader(texto) {
  loaderOverlay.removeAttribute('data-estado');
  loaderText.textContent = texto;
  loaderOverlay.hidden = false;
}
function loaderExito(texto) {
  loaderText.textContent = texto;
  loaderOverlay.setAttribute('data-estado', 'ok'); // cambia la cruz por el check
}
function ocultarLoader() {
  loaderOverlay.hidden = true;
  loaderOverlay.removeAttribute('data-estado');
}
function sacudir(form) {
  form.classList.remove('shake');
  void form.offsetWidth; // reinicia la animación
  form.classList.add('shake');
}

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgLogin.textContent = '';

  const correo = document.getElementById('loginCorreo').value.trim();
  const pass = document.getElementById('loginPass').value.trim();

  mostrarLoader('Verificando datos...');
  // Se espera al menos 0.9 s para que se alcance a ver la animación aunque Neon responda rápido
  const [res] = await Promise.all([iniciarSesion(correo, pass), esperar(900)]);

  if (res.exito) {
    loaderExito('¡Bienvenido, ' + res.usuario.nombre + '!');
    await esperar(1300);
    // Redirige según el rol (cliente, administrador, empleado o cajero)
    window.location.href = rutaInicioSegunRol(res.usuario.rol);
  } else {
    ocultarLoader();
    msgLogin.textContent = res.mensaje;
    sacudir(formLogin);
  }
});

formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgRegister.style.color = '#0F5D52';
  msgRegister.textContent = '';

  const nombre = document.getElementById('regNombre').value.trim();
  const correo = document.getElementById('regCorreo').value.trim();
  const pass = document.getElementById('regPass').value.trim();

  mostrarLoader('Creando tu cuenta...');
  const [res] = await Promise.all([registrarUsuario(nombre, correo, pass), esperar(900)]);

  if (res.exito) {
    loaderExito('¡Cuenta creada!');
    await esperar(1400);
    ocultarLoader();
    formRegister.reset();
    msgRegister.textContent = '';
    window.location.hash = '#iniciar';
  } else {
    ocultarLoader();
    msgRegister.style.color = '#b30000';
    msgRegister.textContent = res.mensaje;
    sacudir(formRegister);
  }
});
