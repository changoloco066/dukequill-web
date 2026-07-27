# DukeQuill Web 🪶

Frontend web del corrector ortográfico DukeQuill. Interfaz visual que consume la [DukeQuill API](https://github.com/tuusuario/dukequill-api) para analizar textos en español con subrayado de errores en tiempo real y animaciones.

---

## ¿Qué hace?

- Área de texto para escribir o pegar texto en español
- Subrayado de errores en tiempo real (rojo = ortografía, azul = puntuación/gramática)
- Tooltips con sugerencias de corrección al pasar el mouse
- Animaciones con Anime.js
- Estadísticas del texto analizado

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML/CSS | Estructura y estilos |
| JavaScript | Lógica del cliente |
| [Anime.js](https://animejs.com/) | Animaciones |
| Fetch API | Comunicación con DukeQuill API |

---

## Cómo ejecutar

Requiere tener [DukeQuill API](https://github.com/tuusuario/dukequill-api) corriendo en `http://localhost:8080`.

Abre `index.html` en tu navegador o usa un servidor local:

```bash
# Con Python
python -m http.server 3000

# Con Node.js
npx serve .
```

---

## Proyecto relacionado

- **[DukeQuill Desktop](https://github.com/tuusuario/dukequill)** — aplicación de escritorio Java/Swing
- **[DukeQuill API](https://github.com/tuusuario/dukequill-api)** — API REST Spring Boot

---

*Parte del ecosistema DukeQuill 🪶*