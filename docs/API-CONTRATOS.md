# Contratos de API — Express + Neon PostgreSQL

## Estado y convenciones

Los tres endpoints confirmados por el usuario son `GET /api/salud`, `POST /api/auth/login` y `GET /api/citas`. No se dispone del código ni del esquema exacto de respuesta de Express: los ejemplos siguientes son contratos de integración propuestos, no evidencia de que ya existan. Las otras rutas son pendientes. No copies datos de ejemplo a producción. No es necesario crear otra base de datos: adapta las rutas a las tablas de tu backend y a las columnas realmente disponibles.

Base: `http://localhost:3000/api`. En rutas privadas, `Authorization: Bearer <JWT>`. El JWT debe estar firmado, no vencido, y su `sub`/`id` debe identificar al usuario; el servidor verifica la firma y el rol efectivo en cada solicitud. Fechas de cita `YYYY-MM-DD`, instantes ISO 8601, importes numéricos o cadenas decimales en PEN; booleanos reales, no cadenas. IDs pueden ser números o cadenas.

Respuestas de lista: un array directo, `{ "citas": [...] }`, `{ "data": [...] }`, `{ "data": { "citas": [...] } }` o `{ "rows": [...] }`. El nombre de la colección depende del endpoint. Respuestas individuales: objeto directo o envoltorio `{ "cita": {...} }`, `{ "pago": {...} }`, `{ "usuario": {...} }` o `{ "data": ... }`. Para mutaciones, devuelve los campos indicados y un status correcto. No devuelvas HTTP 200 con un mensaje de éxito cuando la operación no ocurrió.

Errores: JSON `{ "mensaje": "Descripción segura" }` o `{ "message": "..." }` y HTTP 400/422 para validación, 401 sesión/credenciales, 403 rol/propiedad/turno, 404 recurso o ruta, 409 conflicto (ya pagado, estado modificado, correo duplicado), 500 error interno. No envíes SQL, stack traces, secretos ni datos financieros sensibles al navegador. El frontend también detecta `exito:false`, `ok:false` o `success:false`.

## 1. Autenticación

| Método y ruta | Estado | Acceso |
|---|---|---|
| GET `/api/salud` | Disponible según usuario | Público |
| POST `/api/auth/login` | Disponible según usuario | Público |
| POST `/api/auth/register` | Pendiente | Público |

**Login**: cuerpo `{ "correo": "<correo>", "contrasena": "<contraseña>" }`. Respuesta propuesta: `200 { "token": "<JWT>", "usuario": { "id": 1, "nombre": "Nombre", "correo": "<correo>", "rol": "administrador", "turno": null } }`. El frontend reconoce `token`, `accessToken` o `jwt` y `usuario`/`user`, además de claims planos o anidados. Requiere claim `exp` válido (segundos Unix) y rol válido. Si el backend usa `password` en vez de `contrasena`, ajusta exclusivamente `AuthContext.jsx`. No reenvíes contraseñas en la respuesta.

**Registro de cuenta**: `{ "nombre": "Nombre", "correo": "<correo>", "contrasena": "<contraseña>" }`. `201 { "usuario": { "id": 1, "nombre": "Nombre", "correo": "<correo>", "rol": "cliente" } }`. Rol siempre cliente y no seleccionable desde el formulario público. Valida correo único, contraseña (mínimo de la UI: seis caracteres; fortalece la política en backend), hash y limitación de intentos. No permitas asignar rol desde este endpoint.

## 2. Citas

| Método y ruta | Estado | Acceso y finalidad |
|---|---|---|
| GET `/api/citas` | Disponible según usuario | Administrador/empleado: lista general; reporte de administrador |
| GET `/api/citas/mias` | Pendiente | Cliente: solo sus citas |
| POST `/api/citas` | Pendiente | Cliente: registrar solicitud |
| GET `/api/citas/:id` | Pendiente | Cliente: solo cita propia |
| PATCH `/api/citas/:id` | Pendiente | Cliente: actualizar cita propia elegible |
| POST `/api/citas/presenciales` | Pendiente | Administrador/empleado: registrar cita presencial/telefónica |
| PATCH `/api/citas/:id/gestion` | Pendiente | Administrador/empleado dentro de su turno: editar |
| DELETE `/api/citas/:id/gestion` | Pendiente | Administrador/empleado dentro de su turno: eliminar |

En Express define rutas específicas (`/mias`, `/presenciales`) antes de las rutas parametrizadas cuando corresponda. No uses datos de identidad proporcionados por el navegador para seleccionar el usuario dueño.

**Forma de cita** para panel, reportes, cliente y detalle (ejemplo de campos, no un registro real):

```json
{
  "id": 1001,
  "codigo_seguimiento": "COD-EJEMPLO",
  "nombre_paciente": "Paciente de prueba",
  "dni": "00000000",
  "especialidad": "medicina-general",
  "fecha_preferida": "2026-12-15",
  "fecha_registro": "2026-11-25T15:00:00Z",
  "estado": "registrado",
  "tipo_consulta": "general",
  "tiene_sis": false,
  "monto_calculado": "15.00",
  "estado_pago": "pendiente",
  "canal_pago": null,
  "codigo_operacion": null
}
```

`GET /citas` puede devolver `{ "citas": [ ... ] }`. Debe incluir `id`, `codigo_seguimiento`, `nombre_paciente`, `dni`, `especialidad`, `fecha_preferida`, `estado`, `estado_pago`, `monto_calculado`, `tiene_sis` y `canal_pago` para el panel. Reportes necesita especialidad, fecha, estado, estado de pago, monto. Si existe paginación, implementa recuperación de todas las páginas o un endpoint agregado para que los KPI y reportes no cuenten solo la primera página. Recomendado a futuro: `GET /api/reportes/citas` solo con campos agregables, evitando enviar datos identificables al módulo de reportes; actualmente usa la ruta disponible.

`GET /citas/mias` filtra en SQL por la identidad del JWT; devuelve las citas propias, fecha de registro y `codigo_operacion` del pago aprobado cuando corresponda, sin datos de otros pacientes. `GET /citas/:id` devuelve el detalle de la cita propia (incluyendo `tiene_sis`) en `{ "cita": ... }`.

**POST /citas** (solicitud cliente):

```json
{
  "nombre_paciente": "Paciente de prueba",
  "dni": "00000000",
  "especialidad": "pediatria",
  "fecha_preferida": "2026-12-15",
  "tiene_sis": false,
  "fecha_nacimiento": "2000-01-01",
  "telefono": "900000000",
  "correo": null,
  "motivo": "Control de prueba"
}
```

Servidor genera `id`, código único, `estado: registrado`, fecha, tipo, estado de pago y monto. Vincula `id_usuario` al JWT. Respuesta `201 { "cita": { "id": ..., "codigo_seguimiento": "...", "estado": "registrado", "monto_calculado": 30, "estado_pago": "pendiente" } }`. La aplicación necesita `id`, `codigo_seguimiento`, `monto_calculado` y `estado_pago` para mostrar éxito y redirigir. Revisa el esquema antes de persistir los campos de contacto/motivo: el SQL nativo no los guardaba todos pese a solicitarlos. No se debe perder esa información sin una decisión funcional.

**POST /citas/presenciales**: cuerpo `nombre_paciente`, `dni`, `especialidad`, `fecha_preferida`, `tiene_sis`; respuesta igual a alta de cliente. En la fuente se crea con `id_usuario` nulo. 

**PATCH /citas/:id**: cuerpo `nombre_paciente`, `dni`, `especialidad`, `fecha_preferida`, `tiene_sis`. Solo si el dueño coincide con JWT, el estado es `registrado` y no está pagada. Devuelve `200 { "cita": { "id": ..., ... } }` con el registro actualizado; recalcula las condiciones. 

**PATCH /citas/:id/gestion**: cuerpo `nombre_paciente`, `dni`, `especialidad`, `fecha_preferida`, `estado`; no permite modificar directamente estado de pago. Devuelve `{ "cita": { "id": ..., ... } }`. Protege pagos ya realizados y sus importes. Para empleado, verifica turno efectivo en `America/Lima`: mañana 06:00–13:59, tarde 14:00–21:59, noche-madrugada 22:00–05:59. Administrador sin esa restricción.

**DELETE /citas/:id/gestion**: `204` sin cuerpo (preferido) o `200 { "ok": true }`. Rechaza eliminación con historial de pagos o si el turno/rol no autoriza. El cliente no tiene permiso. Usa integridad referencial y transacción para evitar eliminar una cita mientras se registra un pago.

Reglas: DNI de 8 dígitos, nombre mínimo 4, fecha válida, especialidad existente, teléfono de 9 dígitos si corresponde. Estados `registrado`, `atendido`, `rechazado`, `cancelado`. Estados de pago `pendiente`, `pagado`, `exonerado`. Tarifa original: medicina general S/ 15; otra especialidad S/ 30; SIS activo S/ 0. Valida SIS y recalcula en servidor; no aceptes monto ni código del cliente. La fecha preferida no equivale a cita médica confirmada. Registra auditoría de cambios.

## 3. Pagos y comprobantes

| Método y ruta | Estado | Acceso |
|---|---|---|
| POST `/api/pagos/pasarela` | Pendiente | Cliente, cita propia y pendiente |
| GET `/api/pagos/comprobante/:op` | Pendiente | Cliente dueño, o personal autorizado por reglas de operación |

El frontend filtra las citas pendientes que obtiene de `/citas/mias`. No intenta conectarse a un banco ni fabrica pagos. En el original, los medios de pago se probaban con tablas bancarias/billeteras académicas. Estas rutas deben trabajar exclusivamente con datos de prueba mientras dure la actividad universitaria; no aceptar tarjetas ni códigos de usuarios reales. Para producción reemplazar esta interfaz por tokenización del proveedor de pago certificado.

**Pasarela académica**: cuerpo tarjeta `{ "id_registro": 1001, "metodo": "tarjeta", "numero": "<PAN de prueba>", "vencimiento": "MM/AA", "cvv": "<CVV de prueba>", "titular": "<titular de prueba>" }`. Cuerpo billetera `{ "id_registro": 1001, "metodo": "billetera", "proveedor": "andipay", "celular": "<celular de prueba>", "codigo_aprobacion": "<código de prueba>" }`. Proveedores de la fuente: `andipay`, `pagomovil`. El servidor determina si una tarjeta es de crédito/débito y su marca.

Respuesta de pago realmente aprobado: `201 { "pago": { "id": 42, "estado": "aprobado", "codigo_operacion": "OP-EJEMPLO", "monto": 15 } }`. Para rechazo, devuelve HTTP 422/409 con descripción segura o un objeto con `estado: rechazado`; nunca marques una cita pagada. El frontend requiere literalmente `estado: aprobado` y `codigo_operacion` para navegar al comprobante.

Backend: confirma propiedad, no cancelada/rechazada, monto del ticket, saldo y estado de la cuenta de prueba. Ejecuta bloqueo de fila y una transacción atómica para descontar saldo (si corresponde), insertar el pago y actualizar el estado/canal de cita. Impide doble pago con una restricción/índice único parcial para el pago aprobado de cada cita, manejo de conflictos e idempotencia de la operación. No almacenes CVV, número completo, código de aprobación ni claves; las referencias persistidas deben estar enmascaradas. Redacta logs y errores. El bloqueo del botón React es solo experiencia de usuario, no control financiero.

**Comprobante**: `GET /api/pagos/comprobante/:op`, respuesta `200 { "pago": { "estado": "aprobado", "codigo_operacion": "OP-EJEMPLO", "codigo_seguimiento": "COD-EJEMPLO", "cliente": "Paciente de prueba", "canal": "pasarela", "metodo": "tarjeta_debito", "marca_tarjeta": "Visa", "proveedor_billetera": null, "referencia": "**** 0000", "monto": 15, "monto_recibido": null, "vuelto": null, "fecha_pago": "2026-11-25T16:00:00Z", "cajero": null } }`. El navegador solo habilita impresión si el estado es aprobado. Autoriza el acceso por dueño y alcance del personal; no permitir consultar comprobantes por conocer el código.

## 4. Caja

Todas las rutas siguientes son pendientes y deben ser exclusivas de administrador/cajero. En operaciones de verificación/cobro toma `id_cajero` desde el JWT.

| Método y ruta | Entrada / respuesta |
|---|---|
| GET `/api/caja/pendientes?criterio=...` | `{ "citas": [ { "id": 1001, "codigo_seguimiento": "...", "cliente": "...", "dni": "...", "monto_calculado": 15 } ] }`. Filtro por DNI, código, nombre; incluir citas presenciales. |
| POST `/api/caja/cobros` | Cuerpo `{ "id_registro": 1001, "metodo": "efectivo", "monto_recibido": 20, "referencia": null }`. `201 { "pago": { "estado": "aprobado", "codigo_operacion": "CJ-EJEMPLO", "monto": 15, "vuelto": 5 } }`. |
| GET `/api/caja/pagos?fecha=YYYY-MM-DD&solo_por_verificar=true` | `{ "pagos": [ ... ] }`; devuelve `id`, `codigo_operacion`, `codigo_seguimiento`, `cliente`, `fecha_pago`, `metodo`, `proveedor_billetera`, `marca_tarjeta`, `referencia`, `monto`, `estado`, `motivo_rechazo`, `verificado` y `verificador`. |
| PATCH `/api/caja/pagos/:id/verificar` | Sin cuerpo. `200 { "pago": { "id": 42, "verificado": true } }`. |
| GET `/api/caja/resumen?fecha=YYYY-MM-DD` | `{ "resumen": [ { "canal": "caja", "metodo": "efectivo", "operaciones": 2, "total": 30 } ] }`; solo pagos aprobados agrupados por canal y método. |

El frontend manda método de caja `efectivo`, `pos`, `andipay`, `pagomovil`; el servidor traduce los últimos dos a `metodo: billetera` con `proveedor_billetera` correspondiente. Para POS/billetera usa `referencia` (4 a 12 dígitos) y `monto_recibido: null`; para efectivo verifica importe y calcula vuelto decimal. No cobrar citas cerradas, exoneradas o ya pagadas. Mismas reglas de transacción y doble pago que la pasarela. Verificar solo pagos aprobados y registrar quién/cuándo verificó. No borrar la auditoría. Agrupar la fecha de caja por zona `America/Lima`, no por UTC.

## 5. Usuarios y roles

| Método y ruta | Estado | Acceso |
|---|---|---|
| GET `/api/usuarios` | Pendiente | Administrador |
| PATCH `/api/usuarios/:id/rol` | Pendiente | Administrador |

Lista: `{ "usuarios": [ { "id": 1, "nombre": "Nombre", "correo": "<correo>", "rol": "cliente", "turno": null } ] }`. Nunca incluye `contrasena`, hash ni JWT. 

Cambio: `{ "rol": "empleado", "turno": "mañana" }` o `{ "rol": "cajero", "turno": null }`. Devuelve `{ "usuario": { "id": 1, "rol": "empleado", "turno": "mañana" } }`. Roles permitidos: cliente, administrador, empleado, cajero. Turnos solo para empleado; validación en servidor. Bloquear cambio del propio rol y la eliminación/degradación del último administrador, auditar cambios, y revocar/invalidar sesiones anteriores si cambian los privilegios. El backend debe verificar el rol actual, no confiar solo en un JWT antiguo ni en la UI. 

## 6. Orden recomendado de implementación

1. Confirmar el JSON del login y de `GET /citas` (ya operativos); verificar CORS y expiración del JWT.
2. Crear el registro de cuenta y middleware de identidad, propiedad y rol.
3. Implementar CRUD de citas cliente y gestión presencial/panel con las reglas de turno.
4. Implementar pasarela y comprobantes con transacciones; luego las cinco rutas de caja.
5. Implementar usuarios/roles con auditoría y probar permisos desde una petición HTTP directa. Revisar reportes con la respuesta de citas completa.

Cada módulo debe tener router, controlador, servicio de negocio y repositorio parametrizado según tu estructura `routes/`, `controllers/`, `services/`, `repositories/` y `middlewares/`. No es necesario modificar React cuando Express respeta estos contratos.
