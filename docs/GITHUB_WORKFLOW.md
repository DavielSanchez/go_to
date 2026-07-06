# Gobierno del repositorio GitHub

## Flujo de ramas

`feature/*` y `fix/*` se integran en `develop`. Una release validada pasa de `develop` a `main`. Los `hotfix/*` parten de `main` y deben volver también a `develop`.

## Entornos

- `development`: integración frecuente y pruebas internas.
- `staging`: aceptación del piloto con datos no productivos.
- `production`: operación real; requiere aprobación manual y secretos propios.

El workflow **Promote environment** establece el límite de cada entorno. Cuando exista proveedor de hosting, su acción de despliegue y secretos deben agregarse únicamente a ese job.

## Protección recomendada en GitHub

Configurar rulesets para `main` y `develop`:

- Pull request obligatorio; al menos una aprobación en `main`.
- Conversaciones resueltas antes de integrar.
- Estado requerido: `validate` del workflow CI.
- Rama actualizada antes de merge.
- Sin force push ni eliminación.
- Solo squash merge para mantener un historial legible.

En `production`, exigir aprobación de `DavielSanchez`, impedir autoaprobación y limitar despliegues a `main` o tags `v*`.

## Versionado

Se usa SemVer. Cada release necesita `docs/releases/vX.Y.Z.md`. Un tag `vX.Y.Z` genera automáticamente un GitHub Release con el build del frontend adjunto.

