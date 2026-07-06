# Arquitectura de Vía

## Componentes

- `frontend/`: aplicación cliente independiente. Contiene React 19, estilos, `index.html` y configuración Vite.
- `backend/`: API REST Express 5, modelos MongoDB, rutas, seed y pruebas de integración.
- La raíz conserva la orquestación compartida (`package.json`, variables de entorno, Docker Compose y documentación).
- MongoDB 8: fuente de verdad operacional.
- JWT: sesiones stateless de ocho horas por defecto.
- Docker Compose: MongoDB local reproducible con volumen persistente.

El navegador usa `/api`; Vite lo redirige a `http://localhost:4000` durante desarrollo. En producción se recomienda publicar cliente y API bajo el mismo dominio o configurar `VITE_API_URL` y `CORS_ORIGIN`.

## Modelo de datos

| Colección | Propósito | Índices importantes |
|---|---|---|
| users | Identidad y rol | email único |
| employees | Perfil laboral, dirección, beneficio y QR | employeeCode y qrToken únicos |
| schedules | Turno por empleado y fecha | employee + workDate único |
| transportrequests | Estado diario del beneficio | employee + serviceDate único |
| vehicles | Capacidad y disponibilidad de flota | code y plate únicos |
| drivers | Perfil y vehículos autorizados | license único |
| routes | Plan diario, vehículo y pasajeros | code + serviceDate único |
| boardings | Evidencia de abordaje | route + employee para abordajes permitidos |
| eligibilityrules | Reglas configurables | key única |
| auditlogs | Trazabilidad de cambios | orden temporal |

## Flujo principal

1. RRHH crea al empleado y registra su dirección.
2. Workforce registra/importa el horario.
3. La API evalúa actividad, beneficio, hora de salida y overtime.
4. Se crea o actualiza la solicitud diaria.
5. El empleado confirma o cancela.
6. Operaciones genera el plan automático por zona y capacidad.
7. Operaciones ajusta y aprueba rutas.
8. El conductor valida QR o código contra la ruta asignada.
9. La API bloquea duplicados y registra ad hoc con razón.
10. Dashboard y auditoría reflejan el resultado desde MongoDB.

## Roles

| Rol | Responsabilidad principal |
|---|---|
| admin | Acceso administrativo completo |
| hr | Empleados, elegibilidad general y reglas autorizadas |
| workforce | Horarios y overtime autorizado |
| operations | Demanda, rutas, flota, excepciones y abordaje de respaldo |
| provider | Consulta de flota, conductores y operación asignada |
| supervisor | Equipo directo y aprobación de excepciones |
| trainer | Alta inicial de empleados durante onboarding |
| driver | Pasajeros asignados y abordaje |
| employee | Solicitudes propias, confirmación e historial |

## Seguridad

- Contraseñas con bcrypt, factor de costo 12 en el seed.
- JWT firmado con secreto obligatorio en producción.
- RBAC aplicado en cada escritura sensible.
- Helmet, CORS allowlist y límite JSON de 2 MB.
- Validación Zod en entradas de negocio.
- Auditoría con actor, entidad, antes/después, metadata e IP.
- Los QR son tokens aleatorios de 192 bits y no contienen información personal.
