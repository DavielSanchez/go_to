# API REST v1 (MVP)

Base local: `http://localhost:4000/api`. Excepto `/health` y `/auth/login`, enviar `Authorization: Bearer <token>`.

## Autenticación

- `POST /auth/login` — correo y contraseña; retorna JWT y usuario.
- `GET /auth/me` — sesión actual.

## Operación

- `GET /dashboard?date=YYYY-MM-DD` — KPIs, rutas y auditoría reciente.
- `GET /employees` — empleados visibles para el rol.
- `POST /employees` — alta por admin, RRHH o trainer.
- `PATCH /employees/:id` — actualización por admin o RRHH.
- `POST /employees/:id/schedules` — crea horario, recalcula elegibilidad y solicitud.
- `GET /employees/:id/history` — historial de transporte.
- `GET /requests` — solicitudes visibles para el rol.
- `POST /requests/:id/confirm` — confirma servicio.
- `POST /requests/:id/cancel` — cancela servicio.
- `POST /requests/exception` — overtime, emergencia, cambio o sustitución.
- `POST /requests/:id/approve` — aprobación de supervisor/operaciones.
- `GET /routes?date=YYYY-MM-DD` — plan diario.
- `POST /routes` — ruta manual.
- `POST /routes/auto-plan` — agrupación por zona y capacidad.
- `POST /routes/:id/approve` — aprobación operativa.
- `PATCH /routes/:id/assignments` — reasignación manual auditable.
- `GET /boarding/route/:routeId` — abordajes de una ruta.
- `POST /boarding/scan` — validación y registro de abordaje.

## Administración

- `GET|POST /admin/vehicles`
- `GET|POST /admin/drivers`
- `GET /admin/rules`
- `PUT /admin/rules/:key`
- `GET /admin/audit?limit=100`

## Formato de error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos.",
    "details": {}
  }
}
```

Códigos comunes: `AUTH_REQUIRED` (401), `INVALID_TOKEN` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `DUPLICATE` (409) y `INTERNAL_ERROR` (500).
