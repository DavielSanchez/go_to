# Contribución

## Ramas

- `main`: versión estable y candidata a producción.
- `develop`: integración continua para la siguiente versión.
- `feature/<descripcion>`: funcionalidad nacida desde `develop`.
- `fix/<descripcion>`: corrección nacida desde `develop`.
- `hotfix/<descripcion>`: corrección urgente nacida desde `main` y luego integrada en `develop`.

No se trabaja directamente sobre `main`. Los cambios llegan mediante pull request, CI aprobada y revisión.

## Flujo mínimo

1. Actualizar `develop` y crear una rama corta.
2. Implementar y actualizar la documentación de release.
3. Ejecutar `npm run test:api` y `npm run build`.
4. Abrir PR hacia `develop` usando la plantilla.
5. Para liberar, abrir PR de `develop` a `main` y crear un tag semántico, por ejemplo `v0.4.0`.

## Commits

Usar mensajes breves con intención clara: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:` o `ci:`.

## Variables y datos

Nunca versionar `.env`, credenciales, datos personales ni respaldos de MongoDB. `.env.example` es el contrato de configuración permitido.

