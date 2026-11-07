# Guía de contribución

Gracias por querer mejorar este proyecto. Sigue estos pasos para que tus cambios pasen el pipeline a la primera.

## 1. Preparar el entorno

```bash
git clone https://github.com/yostin13jm/practica3-devops-itla.git
cd practica3-devops-itla
npm install
```

Necesitas **Node.js 20 o superior**.

## 2. Crear una rama

No trabajes directamente en `main`.

```bash
git checkout -b feature/nombre-corto
```

Prefijos sugeridos: `feature/` (funcionalidad nueva), `fix/` (corrección de errores), `docs/` (documentación).

## 3. Hacer los cambios

- Mantén el estilo del código existente (indentación de 2 espacios, comentarios en español).
- Toda funcionalidad nueva o corrección debe incluir **al menos una prueba** en `tests/app.test.js`.
- Si cambias la API, actualiza la tabla de endpoints del `README.md`.

## 4. Comprobar en local

Antes de hacer commit, ejecuta lo mismo que corre el pipeline:

```bash
npm run lint
npm test
```

Ambos comandos deben terminar sin errores.

## 5. Mensajes de commit

Usa mensajes cortos y en imperativo, por ejemplo:

```
Agrega endpoint DELETE para eliminar tareas
Corrige ids repetidos al eliminar tareas
```

## 6. Abrir un Pull Request

1. Sube tu rama: `git push -u origin feature/nombre-corto`.
2. Abre un Pull Request hacia `main` en GitHub.
3. Describe qué cambiaste y por qué.
4. Espera a que el workflow **CI/CD** termine en verde. Si falla, revisa el log en la pestaña **Actions**, corrige y vuelve a hacer push.

El despliegue a GitHub Pages solo ocurre cuando los cambios llegan a `main`.

## Reportar errores

Abre un *Issue* en GitHub con los pasos para reproducir el error, el resultado esperado y el resultado obtenido.