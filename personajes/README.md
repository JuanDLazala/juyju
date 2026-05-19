# 🌙 Mundo Mágico de Juana y Papá

> Una colección de juegos web hechos a 4 manos por **Papá Juan** y su hija **Juana**.

Es una "estación de juegos" (hub) donde van apareciendo nuevas aventuras a medida que las creamos juntos. Cada juego vive en su propia carpeta y se autodescubre desde el catálogo del index.

---

## 🎮 Juegos disponibles

| Juego | Estilo | Estado |
|-------|--------|--------|
| 🌙 **Juana no quiere dormir** | Aventura nocturna estilo Pac-Man con sopa mágica y modo 2 jugadores (local u online vía WebRTC) | ✅ Disponible |
| 📖 El cuento de Juana | Historia interactiva con decisiones | 🔒 Próximamente |
| 🎨 Pinta con Magia | Lienzo digital con efectos | 🔒 Próximamente |

---

## 🚀 Cómo jugar

Solo abre `index.html` en tu navegador (Chrome o Edge recomendados) y elige una aventura.

### Modo online del Pac-Man

Requiere abrir el sitio desde una URL HTTPS (Netlify lo da gratis). Crea una sala, comparte el código, y el otro jugador se conecta desde su propio computador. La conexión es peer-to-peer vía WebRTC, sin servidor intermedio.

---

## 📁 Estructura

```
.
├── index.html          ← Hub / launcher
├── style.css           ← Estilos del hub
├── personajes/         ← Fotos para los carteles
└── juegos/
    └── juana-no-quiere-dormir/
        ├── index.html
        ├── style.css
        ├── game.js
        └── network.js
```

## ➕ Agregar un juego nuevo

1. Crea una carpeta en `juegos/nombre-del-juego/`
2. Agrega un objeto al array `JUEGOS` dentro de `index.html`

```js
{
  id: 'nombre-del-juego',
  nombre: 'Nombre Bonito',
  subtitulo: 'Una línea',
  descripcion: 'Descripción más larga.',
  emoji: '🎮',
  color: '#ff4f9c',
  ruta: 'juegos/nombre-del-juego/index.html',
  tags: ['Tag1', 'Tag2'],
  estado: 'disponible'
}
```

---

## 💖 Filosofía

> "No crear un juego donde un personaje recoge objetos.
> Crear una aventura nocturna donde Juana corre por la casa recogiendo cuentos y estrellas
> antes de que papá la mande a dormir, usando sopa mágica para invertir la persecución."

Hecho con muchísimo amor por **Juan** y **Juana** 🌙✨
