# Plantilla DevOps — Electiva 1 (ITLA 2026-C-3)

Aplicación web mínima (lista de tareas) con todo lo necesario para practicar un pipeline **CI/CD** sin cuentas pagas ni Azure:

| Pieza | Archivo | Para qué sirve |
|---|---|---|
| App Node.js/Express | `src/app.js`, `src/server.js` | API de tareas + `/health` y `/metrics` |
| Frontend estático | `public/index.html` | Se publica en GitHub Pages |
| Pruebas automatizadas | `tests/app.test.js` | Jest + Supertest con cobertura |
| Contenedor | `Dockerfile` | Imagen de producción con *healthcheck* |
| Pipeline | `.github/workflows/ci.yml` | Lint → pruebas → build Docker → deploy a Pages |

## Requisitos (gratis)
- Cuenta de **GitHub** (usa un repositorio **público**: GitHub Actions es gratuito).
- **Git** y **Node.js 20+**. Opcional para probar el contenedor en tu PC: **Docker Desktop**.

## Ejecutar en tu computadora
```bash
npm install
npm test          # pruebas + cobertura
npm start         # http://localhost:3000
```
Endpoints: `GET /health`, `GET /metrics`, `GET/POST /api/tareas`, `PATCH /api/tareas/:id`.

Con Docker:
```bash
docker build -t tareas-devops .
docker run -p 3000:3000 tareas-devops
```

## Subirlo a GitHub y activar el pipeline
1. Crea un repositorio **público** vacío en GitHub (sin README).
2. En la carpeta de la plantilla:
   ```bash
   git init
   git add .
   git commit -m "Plantilla inicial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: GitHub Actions**.
4. Abre la pestaña **Actions**: verás el workflow *CI/CD* ejecutándose. Cuando termine, la URL de tu página aparece en el job *Despliegue a GitHub Pages*.

## Práctica 3 — qué debes agregar
- Al menos **2 pruebas nuevas** (por ejemplo: borrar tareas, validar títulos largos).
- Una funcionalidad nueva pequeña con su prueba (ej. `DELETE /api/tareas/:id`).
- Provocar a propósito una prueba fallida, mostrar que el pipeline se pone en **rojo**, corregirla y mostrarlo en **verde**.
- Completar este README con la explicación de cada etapa del pipeline.

## Proyecto Final — cómo extenderla
- Persistencia con **SQLite** (o MongoDB) en lugar del arreglo en memoria.
- Publicar la imagen en **GitHub Container Registry** (`ghcr.io`) desde el pipeline.
- Análisis estático real (ESLint) y umbral de cobertura mínima.
- Monitoreo: usar `/metrics` y los logs JSON; definir al menos una **alerta** (ej. errores > 0).
- Documentar: guía de instalación, manual de operaciones y lecciones aprendidas.

## Endpoint agregado en la Práctica 3

| Método | Ruta | Descripción |
|---|---|---|
| DELETE | `/api/tareas/:id` | Elimina una tarea; responde 200 si la elimina y 404 si no existe |

El frontend (`public/index.html`) tiene un botón **Eliminar** en cada tarea.

## Pruebas agregadas

1. `DELETE /api/tareas/:id` elimina una tarea.
2. `DELETE` de una tarea inexistente devuelve 404.

Se ejecutan con `npm test` (Jest + Supertest), que también genera el reporte de cobertura.

## El pipeline paso a paso

Archivo: `.github/workflows/ci.yml`. Se ejecuta en cada **push** y **pull request** hacia `main`.

### Job 1 — Build y pruebas (`build-test`)

| Etapa | Qué hace |
|---|---|
| `actions/checkout@v4` | Descarga el código del repositorio en el runner. |
| `actions/setup-node@v4` | Instala Node.js 20. |
| `npm install` | Instala las dependencias. |
| Revisión estática (`npm run lint`) | Verifica la sintaxis de `app.js` y `server.js` con `node --check`. |
| Pruebas con cobertura (`npm test`) | Ejecuta Jest. Si una prueba falla, el pipeline se pone en **rojo** y no se despliega. |
| Construir imagen Docker | Construye la imagen para comprobar que el `Dockerfile` es válido. |

### Job 2 — Despliegue a GitHub Pages (`deploy-pages`)

Solo se ejecuta si `build-test` terminó bien (`needs: build-test`) y el evento es un **push a `main`**.

| Etapa | Qué hace |
|---|---|
| `actions/configure-pages@v5` | Prepara la configuración de Pages. |
| `actions/upload-pages-artifact@v3` | Empaqueta la carpeta `public/`. |
| `actions/deploy-pages@v4` | Publica el artefacto y devuelve la URL de la página. |

> GitHub Pages solo sirve archivos estáticos: en la página publicada se ve el aviso de «versión estática». La API se usa con `npm start`.

## Instrucciones de despliegue

1. Repositorio **público** en GitHub.
2. **Settings → Pages → Source: GitHub Actions**.
3. Haz push a `main`: el workflow se ejecuta solo.
4. En **Actions**, abre el run y busca la URL en el job *Despliegue a GitHub Pages*.

## Demostración rojo → verde

1. Se cambió a propósito una prueba para que fallara y se hizo push → pipeline en **rojo** (despliegue omitido).
2. Se corrigió la prueba y se hizo push → pipeline en **verde** (pruebas OK y despliegue realizado).

## Contribuir

Consulta [CONTRIBUTING.md](CONTRIBUTING.md).