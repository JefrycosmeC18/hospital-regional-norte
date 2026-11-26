# Hospital Regional del Norte — React + Vite

Migración de la rama `renovacion-institucional-previa-react` entregada en el ZIP nativo. Se usó ese ZIP como fuente de diseño y de comportamiento; no se reutilizó el renderizador JSON/HTML de la versión anterior de React.

## 1. Inicio en Visual Studio Code

Requiere Node.js 20.19+ o 22.12+ (Node 24 también sirve) y npm. El backend `hospital-backend` es un proyecto independiente y debe estar en ejecución.

**Terminal 1, en tu backend existente:**

```powershell
cd C:\Users\USER\Documents\hospital-backend
node server.js
```

Comprueba en PowerShell que el servidor esté accesible:

```powershell
Invoke-RestMethod http://localhost:3000/api/salud
```

**Terminal 2, en esta carpeta (donde está `package.json`):**

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Abre `http://localhost:5173`. El archivo `.env` del frontend contiene exclusivamente `VITE_API_URL=http://localhost:3000`. No añadas `/api` al final: `src/services/api.js` ya lo agrega. Si el backend usa otro puerto o se publica, modifica esa URL y reinicia Vite. El backend debe permitir mediante CORS el origen `http://localhost:5173` y los encabezados `Content-Type` y `Authorization`. Si cambias el puerto de Vite, actualiza también CORS.

```powershell
npm test
npm run build
npm run preview
```

`npm run build` genera `dist/`. En producción se necesita un alojamiento SPA que sirva `index.html` para las rutas React; se incluyen una configuración de Vercel y `_redirects` para servicios que admiten ese archivo. Publica el backend por HTTPS y configura su URL pública antes de compilar el frontend.

## 2. Qué contiene el proyecto

```text
src/
  App.jsx                   rutas, compatibilidad .html y protección por rol
  main.jsx                  raíz React, BrowserRouter y AuthProvider
  pages/                    15 páginas JSX originales + UsuariosPage
  components/
    Common.jsx              protección, perfil, accesibilidad, opciones, avisos, cintas
    Clinical.jsx            tarjetas, seguimiento, calendario, filas editables, reportes, comprobante
  context/
    AuthContext.jsx         estado de sesión JWT y API autenticada
  hooks/                    un hook por módulo y hooks reutilizables
    useResource.js           GET, error, carga, recarga, cancelación y polling
    modelUtils.jsx          formularios controlados y utilidades compartidas
  services/
    api.js                  fetch, Bearer, errores y adaptación de respuestas
    domain.js               estados, filtros y reglas de interfaz
    tarifario.js            tarifa original como función pura
    validaciones.js         validación de tarjeta y billetera (pruebas académicas)
  styles/bridge.css         ajustes específicos de integración React
  assets/                   información de las imágenes externas
public/css/                 16 CSS originales, sin modificar
public/_redirects            fallback SPA
  tests/                    pruebas aisladas de reglas, API y estructura (en la raíz)
  docs/                     contratos de API y verificación (en la raíz)
```

Las páginas tienen marcado JSX explícito, sin HTML serializado ni `dangerouslySetInnerHTML`. Los componentes reciben props (por ejemplo `AppointmentCard`, `PanelRow`, `CalendarGrid`). Los hooks de página devuelven propiedades y contenido React para sus elementos JSX. No se copió ningún script que conectaba directamente a PostgreSQL.

## 3. Funcionalidades y estado de integración

| Módulo | Frontend implementado | Backend |
|---|---|---|
| Inicio, institución, actualidad, contacto | Contenido institucional, enlaces, diseño original, cintas animadas del inicio | No necesita API |
| Especialidades | Búsqueda por texto, categoría y filtrado de horarios | No necesita API; horarios informativos de la fuente |
| Guía de citas | Lista de verificación, avance y reinicio | No necesita API |
| Accesibilidad y perfil | Texto grande, contraste, preferencias locales, perfil, menú por rol | Perfil depende del login |
| Login | Formulario, loader, JWT, expiración y redirección por rol | `POST /api/auth/login` reportado disponible; verificar formato exacto |
| Registro de cuenta | Formulario, validación y loader | `POST /api/auth/register` pendiente |
| Solicitar cita | Asistente de tres pasos, validaciones, estimación SIS/general/especialidad, código confirmado, historial de sesión, redirección | `POST /api/citas` pendiente |
| Mis citas | Tarjetas, seguimiento, tabla, filtros, acciones | `GET /api/citas/mias` pendiente |
| Actualizar cita | Carga, edición condicionada a estado/pago, recálculo estimado | `GET /api/citas/:id` y `PATCH /api/citas/:id` pendientes |
| Panel | KPI, calendario, búsqueda/filtros, alta presencial, edición/eliminación con turno | `GET /api/citas` reportado disponible; escrituras pendientes |
| Pago | Selección de ticket, tarjeta visual, validaciones, billetera, loader, redirección solo tras aprobación API | `GET /api/citas/mias` y `POST /api/pagos/pasarela` pendientes |
| Caja | Búsqueda, diálogo en dos pasos, efectivo/POS/billeteras, vuelto, verificación, actualización cada 15 s, cierre | Endpoints de caja pendientes |
| Comprobante | Detalle confirmado, impresión y regreso por rol | `GET /api/pagos/comprobante/:op` pendiente |
| Reportes | Filtro, KPI, barras, dona, evolución, pagos y CSV | Usa `GET /api/citas` para administrador, si incluye las columnas requeridas |
| Usuarios y roles | Página adicional con búsqueda, rol, turno y edición | `GET /api/usuarios` y `PATCH /api/usuarios/:id/rol` pendientes |

**Los únicos endpoints que el usuario ha confirmado que funcionan son `GET /api/salud`, `POST /api/auth/login` y `GET /api/citas` (administrador/empleado).** No se proporcionó el código de Express ni ejemplos exactos de su JSON. Las otras rutas son contratos propuestos para completar el backend. No hay datos de demostración en la aplicación, ni operaciones que se marquen como realizadas sin una respuesta válida del servidor. Las pruebas usan datos sintéticos únicamente dentro de `tests/`.

Los 39 registros de citas y los 32 usuarios mencionados por el usuario no se han consultado ni incorporado al ZIP. Deben provenir del backend real. La adaptación de formatos está centralizada en `services/api.js` y `context/AuthContext.jsx`; si tu Express usa otros nombres de propiedades, ajusta el adaptador y los contratos.

## 4. Qué explicar durante la exposición

Flujo general: `Paciente / administrador / cajero → React (interfaz) → API Express (autenticación, autorización, reglas) → Neon PostgreSQL (datos) → Express → React`.

- `useState`: controla formularios, selección, filtros, estado de carga, pasos y errores.
- `useEffect`: carga y cancela consultas al montar o cambiar filtros; actualiza caja cada 15 segundos; sincroniza preferencias y sesión.
- Props: `AppointmentCard` recibe una cita; `PanelRow` recibe la cita y las acciones; `CalendarGrid` recibe el mes, los registros y una función para seleccionar fecha.
- `AuthContext`: conserva únicamente el JWT y el perfil mínimo en memoria y `sessionStorage` de la pestaña. El cierre de sesión y la expiración eliminan la sesión y el historial local.
- React Router: navegación interna con `Link`, rutas declarativas y guardas. Las URL antiguas `.html` se redirigen conservando consultas y hash.
- `fetch`: todas las llamadas pasan por `api.js`; añade `Authorization: Bearer <JWT>` y gestiona HTTP 401, 403, 404 y errores. Las mutaciones requieren los campos de confirmación establecidos.
- El precio que muestra el navegador es una estimación: el backend recalcula y verifica SIS. La aprobación de un pago, el rol, el turno y la propiedad de una cita son decisiones del servidor.

## 5. Seguridad y cambios deliberados

- Nunca publiques el `.env` del backend. La URL PostgreSQL debe vivir únicamente en Express.
- El ZIP nativo tenía una cadena de conexión PostgreSQL en `js/config/neon-config.js`. No fue incluida. Si esa credencial llegó a GitHub, reemplázala o revócala en Neon y elimina el secreto del historial del repositorio. Eliminarlo del archivo actual no revoca un secreto ya expuesto.
- El código nativo comparaba contraseñas directamente. En Express usa hashes seguros (Argon2id o bcrypt), consultas parametrizadas y nunca devuelvas contraseñas ni hashes. Audita los usuarios existentes y migra cualquier almacenamiento inseguro.
- `sessionStorage` no protege el token de un XSS; evita inyección HTML y scripts no confiables, limita la vigencia del token y considera cookies HttpOnly/Secure/SameSite con un diseño CSRF en una futura versión de producción.
- Los formularios de pago conservan la experiencia del simulador bancario académico de la fuente, pero llaman al backend. **Úsalos exclusivamente con datos de prueba.** No son una pasarela bancaria certificada; no ingreses PAN, CVV, OTP ni billeteras reales. Un entorno real requiere un proveedor certificado/tokenización y tratamiento conforme a PCI DSS.
- El historial local ahora guarda únicamente código, importe e ID en la sesión de la pestaña, separado por cuenta y borrado al salir. No persiste nombres ni datos médicos en `localStorage`. El historial oficial permanece en la base de datos.
- El registro de cita manda todos los campos visibles (fecha de nacimiento, teléfono, correo y motivo), aunque el SQL nativo solo persistía parte de ellos. El backend debe validar y definir su almacenamiento, y no desecharlos silenciosamente.
- Se respetó la regla de turnos del panel con hora de Lima. La gestión de usuarios y roles es una página nueva solicitada: la fuente nativa gestionaba estos roles directamente en el editor SQL.
- Los recursos visuales externos se conservan por URL. Requieren acceso a Internet y no se comprobó su disponibilidad desde este entorno.

## 6. Verificación realizada y pendiente

- 15 páginas originales migradas a JSX + 1 página de usuarios.
- 16 CSS copiados byte por byte, más `bridge.css` separado.
- 39 archivos JavaScript/JSX analizados y transpilados de forma aislada con TypeScript: cero errores de sintaxis o de identificadores/exportaciones no resueltos en la comprobación estática.
- `npm test`: 11 pruebas aprobadas (reglas, validaciones, contratos/errores API, rutas e imports estáticos, ausencia de conexión directa).
- `npm install` intentado: falló con `EAI_AGAIN registry.npmjs.org` (DNS/red del entorno de trabajo). Por ello no se pudo ejecutar la aplicación en navegador ni confirmar una compilación real de Vite. Debes hacerlo en tu PC.
- El backend local de tu computadora no está disponible aquí. La integración HTTP real, las 39 citas, permisos y los flujos de escritura deben verificarse con el backend.

Consulta [Contratos de API](docs/API-CONTRATOS.md) y [Lista de verificación](docs/VERIFICACION.md) para completar la entrega.
