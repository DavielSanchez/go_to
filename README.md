# Vía — Transporte corporativo

MVP full-stack para gestionar elegibilidad, confirmaciones, rutas, flota y abordaje con trazabilidad.

## Estructura

- `frontend/`: cliente React y configuración Vite.
- `backend/`: API Express, MongoDB, seeds y pruebas.
- `docs/`: arquitectura, API e historial detallado de releases.
- La raíz contiene los scripts que orquestan ambas aplicaciones; no es necesario entrar en sus carpetas para ejecutarlas.

## Inicio rápido

Requiere Node.js 20+, npm, Docker y Docker Compose.

```bash
copy .env.example .env
docker compose up -d mongo
npm install
npm run seed
npm run dev:all
```

Vite mostrará la URL del cliente y elegirá un puerto disponible. La API usa `http://localhost:4000`; compruebe `http://localhost:4000/api/health`.

Acceso inicial de operaciones: `operaciones@via.local` / `ViaDemo2026!`. Casos de piloto: `conductor@via.local`, `empleado.noelegible@via.local` y `empleado.confirmado@via.local`, con la misma contraseña demo. Consulte todos los roles en la salida de `npm run seed`. Cambie credenciales y `JWT_SECRET` antes de operar con información real.

## Comandos

- `npm run dev`: cliente Vite.
- `npm run dev:api`: API con recarga.
- `npm run dev:all`: cliente y API.
- `npm run build`: build del cliente.
- `npm run seed`: reinicia y carga la base configurada.
- `npm run test:api`: pruebas de API.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Flujo de GitHub, ramas y entornos](docs/GITHUB_WORKFLOW.md)
- [Release v0.4.1](docs/releases/v0.4.1.md)
- [Historial de releases](docs/releases/)
- [Plantilla de releases](docs/RELEASE_TEMPLATE.md)
