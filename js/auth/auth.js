// js/auth/auth.js
// Autenticación y sesión. Semana 7: iniciarSesion ahora también trae el
// rol ('cliente' | 'administrador' | 'empleado') y se guarda en sesión,
// para que cada página pueda redirigir / proteger según corresponda.

import { sql } from '../config/neon-config.js';

export async function registrarUsuario(nombre, correo, contrasena) {
  try {
    // El rol no se manda aquí: la columna usa DEFAULT 'cliente' en Neon.
    // Administradores y empleados se crean directamente en el SQL Editor.
    const resultado = await sql`
      INSERT INTO usuarios (nombre, correo, contrasena)
      VALUES (${nombre}, ${correo}, ${contrasena})
      RETURNING id, nombre, correo, rol;
    `;
    return { exito: true, usuario: resultado[0] };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (error.message && error.message.includes('unique constraint')) {
      return { exito: false, mensaje: 'El correo electrónico ya se encuentra registrado.' };
    }
    return { exito: false, mensaje: 'Error al conectar con la base de datos.' };
  }
}

export async function iniciarSesion(correo, contrasena) {
  try {
    const resultado = await sql`
      SELECT id, nombre, correo, contrasena, rol FROM usuarios
      WHERE correo = ${correo};
    `;

    if (resultado.length === 0) {
      return { exito: false, mensaje: 'Usuario no encontrado.' };
    }

    const usuario = resultado[0];
    if (usuario.contrasena !== contrasena) {
      return { exito: false, mensaje: 'Contraseña incorrecta.' };
    }

    sessionStorage.setItem('usuario', JSON.stringify({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    }));

    return { exito: true, usuario };
  } catch (error) {
    console.error('Error en login:', error);
    return { exito: false, mensaje: 'Error al verificar credenciales.' };
  }
}

export function obtenerUsuarioActual() {
  const usuarioStr = sessionStorage.getItem('usuario');
  return usuarioStr ? JSON.parse(usuarioStr) : null;
}

export function cerrarSesion() {
  sessionStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

// Protege páginas de cliente (registro.html, consulta.html, actualizar.html):
// exige sesión activa, sin importar el rol.
export function verificarSesionProtegida() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) {
    window.location.href = 'login.html#iniciar';
    return null;
  }
  return usuario;
}

// Protege panel.html: exige sesión Y rol administrador/empleado.
// Un cliente que intente entrar es redirigido a su propio formulario.
export function verificarPanelProtegido() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) {
    window.location.href = 'login.html#iniciar';
    return null;
  }
  if (usuario.rol !== 'administrador' && usuario.rol !== 'empleado') {
    window.location.href = 'registro.html';
    return null;
  }
  return usuario;
}
