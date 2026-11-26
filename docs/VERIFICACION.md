# Guía de verificación de la migración

## Ejecutado en el entorno de entrega

- Inspección de ambos ZIP y comparación de los 16 CSS: iguales byte por byte.
- Análisis y transpilación aislada de 39 archivos fuente JS/JSX con TypeScript disponible en el entorno: cero errores de sintaxis y cero diagnósticos seleccionados de identificadores/exportaciones faltantes. No es una compilación Vite ni una prueba de navegador.
- `npm test`: 11/11 aprobadas. Las pruebas HTTP sustituyen `fetch` únicamente dentro del proceso de pruebas; el frontend nunca usa esas respuestas.
- Comprobación estática de rutas `Link` e imports relativos. No se inspeccionó visualmente la aplicación renderizada.
- Búsqueda de cadenas PostgreSQL, SDK Neon y HTML inyectado en el código fuente: sin coincidencias.
- `npm install`: bloqueado por `EAI_AGAIN registry.npmjs.org`. No fue posible instalar React/Vite en este entorno. No se han verificado llamadas reales al backend, registros del usuario ni una compilación completa.

## Pruebas manuales en tu computadora

| Prueba | Resultado esperado | Dependencia |
|---|---|---|
| `npm install` + `npm run build` | Instalación y generación de `dist/` sin errores | Internet/npm |
| `npm run dev` y abrir `/`, `/institucion`, `/actualidad`, `/servicios`, `/como-funciona`, `/contacto`, `/login` | JSX renderizado, diseño original, imágenes y navegación | Frontend |
| Abrir `/index.html`, `/servicios.html` | Redirige a las rutas nuevas | Frontend |
| Abrir `/institucion#servicios-digitales` desde inicio | Desplazamiento a la sección | Frontend |
| Cambiar filtros de especialidades | Cambia tarjetas y tabla de horarios | Frontend |
| Completar 4 pasos de guía y reiniciar | Progreso 0–4, reinicio a cero | Frontend |
| Alternar modo fácil y contraste, recargar | Persiste preferencia visual; menú adaptable | Frontend |
| Abrir `/panel` o `/caja` sin sesión | Redirección a login | Frontend |
| Login admin correcto/incorrecto | Loader, éxito solo con token válido, error si credenciales fallan | Login disponible según usuario |
| Ir a `/panel` como administrador | GET Bearer, muestra citas reales; si siguen existiendo las 39, KPI total 39 | GET citas disponible según usuario |
| Buscar DNI/código, especialidad, estado; seleccionar día | Filtra las citas obtenidas sin inventar registros | GET citas |
| Abrir `/reportes` como administrador, filtrar y exportar | Gráficos y CSV de registros reales, montos según respuesta | GET citas con todos los campos |
| Login cliente y abrir panel/caja/reportes | UI redirige; petición HTTP directa a rutas ajenas debe devolver 403 | Login y backend |
| Login empleado dentro/fuera de turno | Consulta; edición/eliminación solo cuando corresponde; backend valida turno en Lima | Login, GET y escrituras pendientes |
| Crear cuenta, solicitar cita SIS y particular | Validación, solicitud con ID/código real, importe confirmado; no éxito si falla | Endpoints pendientes |
| Editar cita propia no pagada y probar cita ajena/pagada | Solo cambio autorizado; 403/409 en los demás casos | Endpoints pendientes |
| Pago de prueba aprobado/rechazado | Solo aprobado redirige a comprobante; no doble cobro | Endpoints pendientes |
| Caja: búsqueda, efectivo, POS, QR, vuelto, revisar/confirmar | Datos reales, cobro aprobado, enlace a comprobante | Endpoints pendientes |
| Caja: verificar pago, polling 15 segundos, cierre | Actualización desde API y totales reales | Endpoints pendientes |
| Consultar/imprimir comprobante autorizado | Datos de operación aprobada; no se imprime si no existe | Endpoint pendiente |
| Usuarios: lista, cambio de rol/turno y rechazo propio/último admin | Solo administrador y validación real en Express | Endpoints pendientes |
| Cerrar sesión y vencer token | Se limpia sesión, historial local y rutas protegidas | Login JWT |
| Detener backend y repetir un GET/formulario | Mensaje de conexión, no muestra un éxito falso | Backend local |

En DevTools > Network verifica URL, método, status y `Authorization: Bearer ...`; no publiques capturas de JWT, contraseñas, DNIs o datos de pacientes. En el backend usa una base de pruebas o registros ficticios para ensayar mutaciones sin afectar datos reales.
