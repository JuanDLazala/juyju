/* ============================================================
   "La Heladería de Juana" — Motor del juego
   ------------------------------------------------------------
   Mezcla Mario Bros + Avatar World. 2 jugadores:
     - Juana inventa helados (drag/click de ingredientes)
     - Papá decide en pantalla: ¿DELICIOSO o PUAJ?
     - Si PUAJ → persecución side-scroll padre-hija
   Filosofía: NO HAY combinaciones malas. Solo reacciones.
   ============================================================ */


/* ========== 1. CATÁLOGO DE INGREDIENTES ========== */

const INGREDIENTES = {
  sabores: [
    { id: 'vainilla',   nombre: 'Vainilla',   emoji: '🤍', color: '#fff4dc', desbloqueado: 1, sabor: 'dulce' },
    { id: 'chocolate',  nombre: 'Chocolate',  emoji: '🍫', color: '#5b3a2e', desbloqueado: 1, sabor: 'dulce' },
    { id: 'fresa',      nombre: 'Fresa',      emoji: '🍓', color: '#ff7fb6', desbloqueado: 1, sabor: 'dulce' },
    { id: 'menta',      nombre: 'Menta',      emoji: '🌿', color: '#95e1c1', desbloqueado: 1, sabor: 'fresco' },
    { id: 'mango',      nombre: 'Mango',      emoji: '🥭', color: '#ffb84d', desbloqueado: 1, sabor: 'dulce' },
    { id: 'limon',      nombre: 'Limón',      emoji: '🍋', color: '#ffd866', desbloqueado: 2, sabor: 'fresco' },
    { id: 'uva',        nombre: 'Uva',        emoji: '🍇', color: '#c084fc', desbloqueado: 2, sabor: 'dulce' },
    { id: 'arandano',   nombre: 'Arándano',   emoji: '🫐', color: '#6ec1e4', desbloqueado: 2, sabor: 'dulce' },
    { id: 'coco',       nombre: 'Coco',       emoji: '🥥', color: '#f4e8c8', desbloqueado: 3, sabor: 'dulce' },
    { id: 'cafe',       nombre: 'Café',       emoji: '☕', color: '#4a2d1a', desbloqueado: 3, sabor: 'amargo' },
  ],
  toppings: [
    { id: 'chispas',     nombre: 'Chispas',     emoji: '🌈', color: '#ff7fb6', desbloqueado: 1, sabor: 'dulce' },
    { id: 'oreo',        nombre: 'Oreo',        emoji: '🍪', color: '#3a2a20', desbloqueado: 1, sabor: 'dulce' },
    { id: 'malvavisco',  nombre: 'Malvavisco',  emoji: '☁️', color: '#fff',    desbloqueado: 1, sabor: 'dulce' },
    { id: 'gummy',       nombre: 'Gummy bears', emoji: '🐻', color: '#ff7a3d', desbloqueado: 2, sabor: 'dulce' },
    { id: 'cereza',      nombre: 'Cereza',      emoji: '🍒', color: '#ff5252', desbloqueado: 2, sabor: 'dulce' },
    { id: 'galleta',     nombre: 'Galleta',     emoji: '🍪', color: '#d4a373', desbloqueado: 1, sabor: 'dulce' },
    { id: 'mani',        nombre: 'Maní',        emoji: '🥜', color: '#c87f3a', desbloqueado: 3, sabor: 'salado' },
  ],
  salsas: [
    { id: 'choco-salsa', nombre: 'Choco',       emoji: '🍫', color: '#3a1f10', desbloqueado: 1, sabor: 'dulce' },
    { id: 'fresa-salsa', nombre: 'Fresa',       emoji: '🍓', color: '#ff4f9c', desbloqueado: 1, sabor: 'dulce' },
    { id: 'caramelo',    nombre: 'Caramelo',    emoji: '🍯', color: '#ffb84d', desbloqueado: 2, sabor: 'dulce' },
    { id: 'crema',       nombre: 'Crema',       emoji: '🥛', color: '#fff',    desbloqueado: 1, sabor: 'dulce' },
  ],
  locos: [
    { id: 'pepino',     nombre: 'Pepino',     emoji: '🥒', color: '#6fc94c', desbloqueado: 1, sabor: 'raro' },
    { id: 'ketchup',    nombre: 'Kétchup',    emoji: '🍅', color: '#ff5252', desbloqueado: 1, sabor: 'raro' },
    { id: 'mostaza',    nombre: 'Mostaza',    emoji: '🌭', color: '#ffd866', desbloqueado: 1, sabor: 'raro' },
    { id: 'ajo',        nombre: 'Ajo',        emoji: '🧄', color: '#f4e8c8', desbloqueado: 2, sabor: 'raro' },
    { id: 'pizza',      nombre: 'Pizza',      emoji: '🍕', color: '#ff7a3d', desbloqueado: 2, sabor: 'raro' },
    { id: 'sushi',      nombre: 'Sushi',      emoji: '🍣', color: '#ffb0d4', desbloqueado: 3, sabor: 'raro' },
    { id: 'huevo',      nombre: 'Huevo',      emoji: '🍳', color: '#ffd866', desbloqueado: 2, sabor: 'raro' },
    { id: 'queso',      nombre: 'Queso',      emoji: '🧀', color: '#ffd866', desbloqueado: 1, sabor: 'raro' },
    { id: 'cebolla',    nombre: 'Cebolla',    emoji: '🧅', color: '#c084fc', desbloqueado: 3, sabor: 'raro' },
    { id: 'pimienta',   nombre: 'Pimienta',   emoji: '🌶️', color: '#ff5252', desbloqueado: 3, sabor: 'raro' },
  ],
  magicos: [
    { id: 'polvo',      nombre: 'Polvo estelar', emoji: '✨', color: '#ffd866', desbloqueado: 1, sabor: 'magico' },
    { id: 'unicornio',  nombre: 'Lágrima unicornio', emoji: '🦄', color: '#ffb0d4', desbloqueado: 2, sabor: 'magico' },
    { id: 'rayo',       nombre: 'Rayo de luna', emoji: '🌙', color: '#c084fc', desbloqueado: 2, sabor: 'magico' },
    { id: 'arcoiris',   nombre: 'Arcoíris',     emoji: '🌈', color: '#ff7fb6', desbloqueado: 3, sabor: 'magico' },
    { id: 'corazon',    nombre: 'Corazón',      emoji: '💖', color: '#ff4f9c', desbloqueado: 1, sabor: 'magico' },
    { id: 'estrella',   nombre: 'Estrellita',   emoji: '⭐', color: '#ffd866', desbloqueado: 1, sabor: 'magico' },
  ]
};


/* ========== 2. CATÁLOGO DE CLIENTES (FAMILIA) ========== */
/* Cada cliente tiene:
   - Personalidad y preferencias (qué sabores tiende a amar/odiar)
   - Frases de pedido y reacciones únicas
   - Sprite (SVG simple distintivo)
*/

const CLIENTES = [
  {
    id: 'mama',
    nombre: 'Mamá Laura',
    color: '#ff7fb6',
    pelo: '#5b3a2e',
    pelo_estilo: 'largo',
    accesorio: null,
    sonrisa: 'amplia',
    le_gusta: ['dulce', 'fresco', 'magico'],
    le_disgusta: ['raro'],
    pedido: '¡Hola, mi vida! Algo dulce, porfa 💕',
    reaccionesAmor: ['¡Qué delicia, mi amor!', '¡Está RIQUÍSIMO!', '¡Otro igual, por favor!'],
    reaccionesNeutral: ['Mmm… está bien.', 'Interesante combinación.', 'Diferente, pero rico.'],
    reaccionesAsco: ['Mi amor… ¿qué le pusiste?', '¡Ay no, sácamelo!', '¿Tú probaste esto?']
  },
  {
    id: 'tio-dany',
    nombre: 'Tío Dany',
    color: '#3d7ab8',
    pelo: '#2a2a35',
    pelo_estilo: 'corto',
    accesorio: 'barba',
    sonrisa: 'pícara',
    le_gusta: ['raro', 'amargo'],
    le_disgusta: [],
    pedido: '¡Sobrina! Algo LOCO, sorpréndeme 😎',
    reaccionesAmor: ['¡ESO ES! ¡Genial mezcla!', '¡Mi sobrina es una chef!', '¡Eres una artista!'],
    reaccionesNeutral: ['No está mal…', 'Le falta algo loco.', 'Más fuerte la próxima.'],
    reaccionesAsco: ['Sobrina… esto sí que está fuerte 😅', '¡Me explotó la lengua!', 'Necesito agua. YA.']
  },
  {
    id: 'abuelita',
    nombre: 'Abuelita Sarita',
    color: '#c084fc',
    pelo: '#fff',
    pelo_estilo: 'mono',
    accesorio: 'gafas',
    sonrisa: 'cálida',
    le_gusta: ['dulce'],
    le_disgusta: ['raro', 'amargo'],
    pedido: 'Mi reina, algo dulce como tú 💕',
    reaccionesAmor: ['¡Mi nieta es la mejor!', '¡Qué dulce, igual que tú!', '¡Está divino!'],
    reaccionesNeutral: ['Mmm, no es lo mío, pero rico.', 'A mí algo más dulce…', 'Está bien, mi vida.'],
    reaccionesAsco: ['¡Ay, mi corazón! ¿Qué es esto?', '¡Esto pica! 😱', 'Mejor un cafecito.']
  },
  {
    id: 'tia-adri',
    nombre: 'Tía Adri',
    color: '#7fd8c8',
    pelo: '#4a2d1a',
    pelo_estilo: 'corto',
    accesorio: null,
    sonrisa: 'amplia',
    le_gusta: ['magico', 'dulce'],
    le_disgusta: ['raro'],
    pedido: '¡Algo BRILLANTE y mágico, princesa!',
    reaccionesAmor: ['¡Brillaaa! ✨', '¡Mágico! ¡Perfecto!', '¡Es como un cuento de hadas!'],
    reaccionesNeutral: ['Hermoso de mirar, al menos.', 'Le falta más magia.', 'Bonito, bonito.'],
    reaccionesAsco: ['¡Esto no es mágico, es maléfico!', '¡Sácalo, sácalo!', 'Esto da miedo 👻']
  },
  {
    id: 'tia-cata',
    nombre: 'Tía Cata',
    color: '#95e1c1',
    pelo: '#5b3a2e',
    pelo_estilo: 'rizado',
    accesorio: null,
    sonrisa: 'pícara',
    le_gusta: ['dulce', 'raro', 'magico', 'fresco'],
    le_disgusta: [],
    pedido: '¡Lo que sea! Yo como de TODO 😋',
    reaccionesAmor: ['¡Qué arte!', '¡Eres una crack!', '¡Me lo trago entero!'],
    reaccionesNeutral: ['Mmm, rico igual.', 'Yo me como hasta los palitos.', 'Todo me gusta 😆'],
    reaccionesAsco: ['Pfff, está raro pero pasa 😂', 'Mi estómago aguanta TODO.', '¡Tu tía come hasta piedras!']
  },
  // Papá es especial: humano decide
  {
    id: 'papa',
    nombre: 'Papá',
    color: '#f4e8c8',
    pelo: '#1a1a22',
    pelo_estilo: 'corto',
    accesorio: 'barba',
    sonrisa: 'amplia',
    le_gusta: [],
    le_disgusta: [],
    decideHumano: true,    // Papá real decide con teclado
    pedido: '¡Hola, princesa! Sorpréndeme con algo rico 😋',
    reaccionesAmor: ['¡Mi hija es una CHEF!', '¡EXQUISITO! ¡Otra, por favor!', '¡Qué bárbara, hija!'],
    reaccionesAsco: ['¡PUAJ! ¡Qué es eso!', '¡No, no, no! 🏃', '¡Me voy corriendo!']
  }
];

/* Clientes random que aparecen desde nivel 3 */
const CLIENTES_RANDOM = [
  {
    id: 'dinosaurio', nombre: 'Dino-Rex',
    color: '#6fc94c', pelo: 'transparent', pelo_estilo: 'punta',
    accesorio: null, sonrisa: 'amplia', emoji: '🦖',
    le_gusta: ['raro'], le_disgusta: [],
    pedido: '¡ROAAAR! Algo crujiente, ¡con CARNE si tienes!',
    reaccionesAmor: ['¡ROAAAAAR! ¡Delicioso!', '¡Qué humanos tan creativos!'],
    reaccionesNeutral: ['Mmm, falta picante prehistórico.'],
    reaccionesAsco: ['¡ROAR! ¡Esto no es comida!', '¡Esto sabe a meteorito!']
  },
  {
    id: 'robot', nombre: 'Robi-2.0',
    color: '#bcc7e0', pelo: '#666', pelo_estilo: 'corto',
    accesorio: 'gafas', sonrisa: 'amplia', emoji: '🤖',
    le_gusta: ['magico', 'fresco'], le_disgusta: ['raro'],
    pedido: 'BIP-BOP. Solicitud: helado.exe',
    reaccionesAmor: ['ÓPTIMO. EJECUTANDO FELICIDAD.', '100% APROBADO. BIP.'],
    reaccionesNeutral: ['DATOS INSUFICIENTES.'],
    reaccionesAsco: ['ERROR. SISTEMA EN RECHAZO. 🚨', 'CIRCUITOS DERRETIDOS.']
  },
  {
    id: 'fantasma', nombre: 'Casperito',
    color: '#e0e8ff', pelo: 'transparent', pelo_estilo: 'punta',
    accesorio: null, sonrisa: 'pícara', emoji: '👻',
    le_gusta: ['raro', 'magico'], le_disgusta: [],
    pedido: 'Buuu… algo que asuste a otros niños 👻',
    reaccionesAmor: ['BUUUU ¡ME ENCANTÓ!', 'Esto sí da escalofríos.'],
    reaccionesNeutral: ['Bu… no está taaan asustador.'],
    reaccionesAsco: ['¡Buaa! ¡Yo doy más miedo que esto!', 'Hasta yo me asusté.']
  },
  {
    id: 'unicornio', nombre: 'Princesa Cocó',
    color: '#ffb0d4', pelo: '#ffd866', pelo_estilo: 'largo',
    accesorio: null, sonrisa: 'cálida', emoji: '🦄',
    le_gusta: ['magico', 'dulce'], le_disgusta: ['raro'],
    pedido: 'Algo digno de una princesa 👑',
    reaccionesAmor: ['¡Por mis cuernos, está SUBLIME!', '¡Una obra de arte real!'],
    reaccionesNeutral: ['Mmm, le falta más polvo de hadas.'],
    reaccionesAsco: ['¡Esto es indigno de la realeza!', '¡Mi cuerno se está oxidando!']
  },
  {
    id: 'astronauta', nombre: 'Capi-Estrellas',
    color: '#fff', pelo: '#1a1a22', pelo_estilo: 'corto',
    accesorio: 'gafas', sonrisa: 'amplia', emoji: '👨‍🚀',
    le_gusta: ['magico', 'fresco'], le_disgusta: [],
    pedido: 'Misión: probar el helado más cósmico del universo 🚀',
    reaccionesAmor: ['¡A LA LUNA Y MÁS ALLÁ!', '¡Reporte: increíble!'],
    reaccionesNeutral: ['Gravedad cero de sabor.'],
    reaccionesAsco: ['¡Houston, tenemos un problema!', 'Reporte: explosión en la boca.']
  },
  {
    id: 'pirata', nombre: 'Capitán Bigotes',
    color: '#3d7ab8', pelo: '#1a1a22', pelo_estilo: 'largo',
    accesorio: 'barba', sonrisa: 'pícara', emoji: '🏴‍☠️',
    le_gusta: ['raro', 'amargo'], le_disgusta: [],
    pedido: '¡ARRR! Algo que despierte a un pirata 🏴‍☠️',
    reaccionesAmor: ['¡ARRRR! ¡Tesoro encontrado!', '¡Esto vale 1000 doblones!'],
    reaccionesNeutral: ['Mmm, le falta ron.'],
    reaccionesAsco: ['¡Esto sabe a calcetín de marinero!', '¡A los tiburones contigo!']
  }
];


/* ========== 3. NIVELES Y PROGRESIÓN ========== */

const NIVELES_DATA = [
  { nivel: 1, ventasParaSubir: 4, ingredientesNivel: 1, deco: [],
    desbloqueo: 'Ingredientes básicos + tu familia' },
  { nivel: 2, ventasParaSubir: 5, ingredientesNivel: 2, deco: ['mesa', 'flor'],
    desbloqueo: '¡Más sabores y toppings! Y una mesita afuera 🌸' },
  { nivel: 3, ventasParaSubir: 6, ingredientesNivel: 3, deco: ['mesa', 'flor', 'luces'],
    desbloqueo: '¡PONLE NOMBRE a tu heladería! Y empiezan a venir clientes nuevos 🎉' },
  { nivel: 4, ventasParaSubir: 8, ingredientesNivel: 3, deco: ['mesa', 'flor', 'luces'],
    desbloqueo: 'Tu fama crece. ¡Clientes locos por todos lados!' },
  { nivel: 5, ventasParaSubir: 10, ingredientesNivel: 3, deco: ['mesa', 'flor', 'luces'],
    desbloqueo: '¡Eres una leyenda de los helados!' }
];


/* ========== 4. ESTADO DEL JUEGO ========== */

const juego = {
  nivel: 1,
  monedas: 0,
  popularidad: 10,           // 0-100
  ventasNivel: 0,            // cuántas ventas exitosas este nivel
  nombreTienda: 'Sin nombre',
  helado: [],                // ingredientes del cono actual
  clienteActual: null,
  categoriaActiva: 'sabores',
  reaccionTipo: null,
};


/* ========== 5. INICIO Y NAVEGACIÓN ========== */

/* ----- Sistema de login ----- */
const CLAVES = {
  juana: 'TeAmoPapa',
  papa:  'TeAmoJuanis'
};
let perfilSeleccionado = null;
let perfilActivo = null;   // 'juana' | 'papa' — quién está jugando

function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  document.getElementById(id).classList.add('activa');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function elegirPerfil(perfil) {
  perfilSeleccionado = perfil;
  const zona = document.getElementById('zona-clave');
  zona.classList.remove('oculto');
  const prompt = perfil === 'juana'
    ? '¡Hola Juana! 💖 Escribe tu clave secreta:'
    : '¡Hola Papá! 👨 Escribe tu clave secreta:';
  document.getElementById('clave-prompt').textContent = prompt;
  document.querySelectorAll('.perfil-card').forEach(c => c.classList.remove('seleccionado'));
  const sel = document.querySelector(`[data-perfil="${perfil}"]`);
  if (sel) sel.classList.add('seleccionado');
  const input = document.getElementById('input-clave');
  input.value = '';
  input.classList.remove('incorrecta', 'correcta');
  document.getElementById('clave-error').classList.add('oculto');
  setTimeout(() => input.focus(), 250);
}

function verificarClave() {
  if (!perfilSeleccionado) return;
  const clave = document.getElementById('input-clave').value;
  const correcta = CLAVES[perfilSeleccionado];
  const input = document.getElementById('input-clave');
  const error = document.getElementById('clave-error');

  if (clave === correcta) {
    perfilActivo = perfilSeleccionado;
    input.classList.remove('incorrecta');
    input.classList.add('correcta');
    error.classList.add('oculto');
    if (typeof sonidoFanfare === 'function') sonidoFanfare();
    setTimeout(() => mostrarPantalla('pantalla-portada'), 600);
  } else {
    input.classList.remove('correcta');
    input.classList.add('incorrecta');
    error.classList.remove('oculto');
    if (typeof sonidoSusto === 'function') sonidoSusto();
    setTimeout(() => input.classList.remove('incorrecta'), 500);
    input.value = '';
    input.focus();
  }
}

function cambiarPerfil() {
  perfilSeleccionado = null;
  document.getElementById('zona-clave').classList.add('oculto');
  document.getElementById('input-clave').value = '';
  document.getElementById('clave-error').classList.add('oculto');
  document.querySelectorAll('.perfil-card').forEach(c => c.classList.remove('seleccionado'));
}

function empezarJuego() {
  juego.nivel = 1;
  juego.monedas = 0;
  juego.popularidad = 10;
  juego.ventasNivel = 0;
  juego.nombreTienda = 'Sin nombre';
  juego.helado = [];
  mostrarPantalla('pantalla-tienda');
  actualizarHUD();
  actualizarDecoracion();
  renderizarIngredientes();
  llegaCliente();
}


/* ========== 6. INGREDIENTES (paleta + cono) ========== */

function renderizarIngredientes() {
  const paleta = document.getElementById('paleta-ingredientes');
  paleta.innerHTML = '';
  const cat = INGREDIENTES[juego.categoriaActiva] || [];
  cat.forEach(ing => {
    if (ing.desbloqueado > juego.nivel) return;
    const el = document.createElement('div');
    el.className = 'ingrediente';
    el.innerHTML = `
      <div class="ingrediente-emoji">${ing.emoji}</div>
      <div class="ingrediente-nombre">${ing.nombre}</div>
    `;
    el.addEventListener('click', () => agregarIngrediente(ing));
    paleta.appendChild(el);
  });
}

function agregarIngrediente(ing, event) {
  if (juego.helado.length >= 6) return;
  juego.helado.push(ing);
  renderizarCono();

  // Efectos: plop + brillitos en el cono
  if (typeof sonidoPlop === 'function') sonidoPlop();
  const cono = document.getElementById('cono-helado');
  if (cono && typeof brillitos === 'function') {
    const r = cono.getBoundingClientRect();
    brillitos(r.left + r.width / 2, r.top + r.height / 2);
  }
}

function renderizarCono() {
  const cono = document.getElementById('cono-helado');
  cono.innerHTML = '';
  juego.helado.forEach((ing, idx) => {
    const sc = document.createElement('div');
    sc.className = 'scoop';
    sc.style.background = ing.color;
    sc.style.zIndex = (10 - idx);
    sc.innerHTML = ing.emoji;
    cono.appendChild(sc);
  });
  // habilitar botón servir si hay al menos 1 ingrediente
  const btn = document.getElementById('boton-servir');
  btn.disabled = juego.helado.length === 0;
}

function limpiarCono() {
  juego.helado = [];
  renderizarCono();
  if (typeof sonidoLimpiar === 'function') sonidoLimpiar();
}


/* ========== 7. CLIENTES (llegada + sprites SVG) ========== */

function elegirSiguienteCliente() {
  // Familia obligatoria los primeros niveles, mezcla con random desde nivel 3
  const familia = CLIENTES.slice();
  if (juego.nivel >= 3) {
    return Math.random() < 0.4
      ? CLIENTES_RANDOM[Math.floor(Math.random() * CLIENTES_RANDOM.length)]
      : familia[Math.floor(Math.random() * familia.length)];
  }
  return familia[Math.floor(Math.random() * familia.length)];
}

function llegaCliente() {
  juego.helado = [];
  renderizarCono();
  juego.clienteActual = elegirSiguienteCliente();
  const c = juego.clienteActual;

  // Sprite del cliente
  const zona = document.getElementById('cliente-sprite');
  if (zona) {
    zona.innerHTML = svgCliente(c);
    zona.classList.remove('saliendo');
    zona.classList.add('entrando');
  }

  // Globo del pedido (nuevo HTML tiene #cliente-globo-titulo + #cliente-globo-texto)
  const globo  = document.getElementById('cliente-globo');
  const titulo = document.getElementById('cliente-globo-titulo');
  const texto  = document.getElementById('cliente-globo-texto');
  if (globo) {
    globo.classList.remove('oculto');
    if (titulo) titulo.textContent = 'Pedido de ' + c.nombre;
    if (texto)  texto.textContent  = c.pedido;
  }
}

/* Versión ANIME: usa el sistema modular de personajes.js */
function svgCliente(c, estado) {
  const perfilId = ID_A_PERFIL[c.id];
  return svgPersonaje(perfilId || 'mama', estado || 'normal');
}


/* ========== 8. SERVIR Y REACCIÓN ========== */

function servirHelado() {
  if (juego.helado.length === 0) return;
  const c = juego.clienteActual;
  mostrarPantalla('pantalla-reaccion');

  // Dibujar cliente grande
  document.getElementById('cliente-reaccion').innerHTML = svgCliente(c);

  // Si es papá → humano decide
  if (c.decideHumano) {
    document.getElementById('reaccion-texto').textContent = '¡Probando…!';
    document.getElementById('reaccion-frase').textContent = '';
    document.getElementById('papa-decide').classList.remove('oculto');
    document.getElementById('boton-continuar').classList.add('oculto');
  } else {
    // Cliente automático: evaluar combinación
    const tipo = evaluarCombinacion(c, juego.helado);
    aplicarReaccion(tipo);
  }
}

function evaluarCombinacion(cliente, helado) {
  // Cuenta cuántos ingredientes son del sabor que le gusta vs disgusta
  let puntosGusto = 0;
  let puntosDisgusto = 0;
  helado.forEach(ing => {
    if (cliente.le_gusta.includes(ing.sabor)) puntosGusto++;
    if (cliente.le_disgusta.includes(ing.sabor)) puntosDisgusto++;
  });
  if (puntosDisgusto > puntosGusto) return 'asco';
  if (puntosGusto > puntosDisgusto) return 'amor';
  return 'neutral';
}

function aplicarReaccion(tipo) {
  juego.reaccionTipo = tipo;
  const c = juego.clienteActual;
  let frases, texto, estadoEmocional;

  if (tipo === 'amor') {
    frases = c.reaccionesAmor;
    texto = '¡LE ENCANTÓ! 💖';
    estadoEmocional = 'enamorado';
  } else if (tipo === 'asco') {
    frases = c.reaccionesAsco;
    texto = '¡PUAAAJ! 🤢';
    estadoEmocional = 'asqueado';
  } else {
    frases = c.reaccionesNeutral;
    texto = 'Mmm… 😐';
    estadoEmocional = 'pensativo';
  }
  const frase = frases[Math.floor(Math.random() * frases.length)];

  // Re-dibujar el cliente con la expresión correcta
  document.getElementById('cliente-reaccion').innerHTML = svgCliente(c, estadoEmocional);

  document.getElementById('reaccion-texto').textContent = texto;
  document.getElementById('reaccion-frase').textContent = '"' + frase + '"';
  document.getElementById('papa-decide').classList.add('oculto');
  document.getElementById('boton-continuar').classList.remove('oculto');

  // EFECTOS visuales según reacción
  const rect = document.getElementById('cliente-reaccion').getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  if (tipo === 'amor') {
    corazones(cx, cy);
    sonidoRisa();
    flashColor('rgba(255, 127, 182, 0.25)', 0.4);
  } else if (tipo === 'asco') {
    asco(cx, cy);
    sonidoSusto();
    temblarPantalla(8, 500);
  } else {
    sonidoDing();
  }

  // Si fue asco y es papá → huye y empieza persecución
  if (tipo === 'asco' && c.decideHumano) {
    setTimeout(() => iniciarPersecucion(), 1200);
    return;
  }

  // Pago según reacción
  if (tipo === 'amor') {
    juego.monedas += 10;
    juego.popularidad = Math.min(100, juego.popularidad + 8);
    juego.ventasNivel++;
    setTimeout(() => monedasVolando(cx, cy, 5), 400);
  } else if (tipo === 'neutral') {
    juego.monedas += 5;
    juego.popularidad = Math.min(100, juego.popularidad + 2);
    juego.ventasNivel++;
    setTimeout(() => monedasVolando(cx, cy, 2), 400);
  } else {
    // asco con cliente automático: se va sin pagar
    juego.popularidad = Math.max(0, juego.popularidad - 3);
  }
  actualizarHUD();
}

/* Papá decide manualmente */
function papaDecide(esDelicioso) {
  if (esDelicioso) {
    aplicarReaccion('amor');
  } else {
    aplicarReaccion('asco');
    // Si papá hace PUAJ → persecución inmediata
    iniciarPersecucion();
  }
}

function siguienteCliente() {
  // Verificar si subimos de nivel
  const datos = NIVELES_DATA[juego.nivel - 1];
  if (juego.ventasNivel >= datos.ventasParaSubir) {
    subirDeNivel();
    return;
  }
  // Cliente sale
  document.getElementById('cliente-sprite').classList.remove('entrando');
  document.getElementById('cliente-sprite').classList.add('saliendo');
  document.getElementById('cliente-globo').classList.add('oculto');
  mostrarPantalla('pantalla-tienda');
  setTimeout(llegaCliente, 800);
}


/* ========== 9. PERSECUCIÓN (cuando papá huye) ========== */

const persecucion = {
  papa:  { x: 200, y: 220, vx: 0, vy: 0, enSuelo: true },
  juana: { x: 50,  y: 220, vx: 0, vy: 0, enSuelo: true },
  teclas: {},
  scroll: 0,
  fin: false,
};

function iniciarPersecucion() {
  document.getElementById('boton-continuar').classList.add('oculto');
  mostrarPantalla('pantalla-persecucion');
  persecucion.papa.x = 500; persecucion.papa.y = 220; persecucion.papa.vx = 0; persecucion.papa.vy = 0;
  persecucion.juana.x = 100; persecucion.juana.y = 220; persecucion.juana.vx = 0; persecucion.juana.vy = 0;
  persecucion.scroll = 0;
  persecucion.fin = false;
  loopPersecucion();
}

function loopPersecucion() {
  if (persecucion.fin) return;

  const canvas = document.getElementById('lienzo-persecucion');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Física básica + controles
  const GRAV = 0.6;
  const SUELO = 230;
  const VEL = 4;
  const SALTO = -12;

  // Papá: WASD
  if (persecucion.teclas['a']) persecucion.papa.vx = -VEL;
  else if (persecucion.teclas['d']) persecucion.papa.vx = VEL;
  else persecucion.papa.vx *= 0.8;
  if (persecucion.teclas['w'] && persecucion.papa.enSuelo) {
    persecucion.papa.vy = SALTO; persecucion.papa.enSuelo = false;
  }
  // Por default papá huye a la derecha (IA suave si no hay input)
  if (!persecucion.teclas['a'] && !persecucion.teclas['d']) {
    persecucion.papa.vx = VEL * 0.7;
  }

  // Juana: flechas
  if (persecucion.teclas['arrowleft']) persecucion.juana.vx = -VEL;
  else if (persecucion.teclas['arrowright']) persecucion.juana.vx = VEL * 1.1;
  else persecucion.juana.vx *= 0.8;
  if (persecucion.teclas['arrowup'] && persecucion.juana.enSuelo) {
    persecucion.juana.vy = SALTO; persecucion.juana.enSuelo = false;
  }

  // Aplicar gravedad
  [persecucion.papa, persecucion.juana].forEach(p => {
    p.vy += GRAV;
    p.x += p.vx;
    p.y += p.vy;
    if (p.y >= SUELO) { p.y = SUELO; p.vy = 0; p.enSuelo = true; }
    if (p.x < 20) p.x = 20;
    if (p.x > canvas.width - 50) p.x = canvas.width - 50;
  });

  // Dibujar papá (sprite simple)
  dibujarPapaSprite(ctx, persecucion.papa.x, persecucion.papa.y);
  // Dibujar Juana
  dibujarJuanaSprite(ctx, persecucion.juana.x, persecucion.juana.y);

  // Dibujar nubes y árboles decorativos
  for (let i = 0; i < 3; i++) {
    const cx = (i * 300 - persecucion.scroll * 0.3) % canvas.width;
    dibujarArbol(ctx, cx, 235);
  }

  // Verificar colisión
  const dx = Math.abs(persecucion.papa.x - persecucion.juana.x);
  const dy = Math.abs(persecucion.papa.y - persecucion.juana.y);
  if (dx < 50 && dy < 50) {
    persecucion.fin = true;
    setTimeout(finPersecucion, 200);
    return;
  }

  requestAnimationFrame(loopPersecucion);
}

function dibujarPapaSprite(ctx, x, y) {
  // Cuerpo crema
  ctx.fillStyle = '#f4e8c8';
  ctx.fillRect(x - 18, y - 50, 36, 40);
  ctx.strokeStyle = '#1a1428'; ctx.lineWidth = 2;
  ctx.strokeRect(x - 18, y - 50, 36, 40);
  // Pantalones
  ctx.fillStyle = '#3b3d44';
  ctx.fillRect(x - 18, y - 10, 16, 20);
  ctx.fillRect(x + 2, y - 10, 16, 20);
  ctx.strokeRect(x - 18, y - 10, 16, 20);
  ctx.strokeRect(x + 2, y - 10, 16, 20);
  // Cabeza
  ctx.fillStyle = '#f2c39c';
  ctx.beginPath(); ctx.arc(x, y - 65, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Pelo
  ctx.fillStyle = '#1a1a22';
  ctx.beginPath(); ctx.arc(x, y - 70, 18, Math.PI, Math.PI * 2); ctx.fill();
  // Barba
  ctx.fillStyle = '#33302e';
  ctx.beginPath(); ctx.arc(x, y - 60, 8, 0, Math.PI); ctx.fill();
  // Ojos asustados
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x - 6, y - 68, 4, 0, Math.PI * 2); ctx.arc(x + 6, y - 68, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1428';
  ctx.beginPath(); ctx.arc(x - 6, y - 68, 2, 0, Math.PI * 2); ctx.arc(x + 6, y - 68, 2, 0, Math.PI * 2); ctx.fill();
  // Boca abierta de susto
  ctx.fillStyle = '#1a1428';
  ctx.beginPath(); ctx.ellipse(x, y - 58, 3, 4, 0, 0, Math.PI * 2); ctx.fill();
  // Helado en la mano
  ctx.fillStyle = '#ff7fb6';
  ctx.beginPath(); ctx.arc(x + 22, y - 35, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f5e6cc';
  ctx.beginPath(); ctx.moveTo(x + 22, y - 28); ctx.lineTo(x + 18, y - 18); ctx.lineTo(x + 26, y - 18); ctx.closePath(); ctx.fill();
}

function dibujarJuanaSprite(ctx, x, y) {
  // Camiseta rosa
  ctx.fillStyle = '#f7a7c4';
  ctx.fillRect(x - 14, y - 42, 28, 30);
  ctx.strokeStyle = '#1a1428'; ctx.lineWidth = 2;
  ctx.strokeRect(x - 14, y - 42, 28, 30);
  // Shorts azules
  ctx.fillStyle = '#1a8fbf';
  ctx.fillRect(x - 14, y - 12, 12, 18);
  ctx.fillRect(x + 2, y - 12, 12, 18);
  ctx.strokeRect(x - 14, y - 12, 12, 18);
  ctx.strokeRect(x + 2, y - 12, 12, 18);
  // Cabeza
  ctx.fillStyle = '#f4c69a';
  ctx.beginPath(); ctx.arc(x, y - 55, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Pelo castaño con flequillo
  ctx.fillStyle = '#4a2d1a';
  ctx.beginPath(); ctx.arc(x, y - 60, 16, Math.PI, Math.PI * 2); ctx.fill();
  // Trenzas (laterales)
  ctx.beginPath(); ctx.arc(x - 16, y - 50, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 16, y - 50, 5, 0, Math.PI * 2); ctx.fill();
  // Lacitos rojos
  ctx.fillStyle = '#e83e3e';
  ctx.beginPath(); ctx.arc(x - 16, y - 42, 3, 0, Math.PI * 2); ctx.arc(x + 16, y - 42, 3, 0, Math.PI * 2); ctx.fill();
  // Ojos manga
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(x - 5, y - 56, 3, 4, 0, 0, Math.PI * 2); ctx.ellipse(x + 5, y - 56, 3, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5b3520';
  ctx.beginPath(); ctx.arc(x - 5, y - 55, 2.2, 0, Math.PI * 2); ctx.arc(x + 5, y - 55, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1428';
  ctx.beginPath(); ctx.arc(x - 5, y - 55, 1.2, 0, Math.PI * 2); ctx.arc(x + 5, y - 55, 1.2, 0, Math.PI * 2); ctx.fill();
  // Sonrisa pícara con lengüita
  ctx.strokeStyle = '#3a1e10'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y - 48, 3, 0, Math.PI); ctx.stroke();
  ctx.fillStyle = '#ff7fa3';
  ctx.fillRect(x - 1, y - 46, 2, 2);
  // Cuchara extendida
  ctx.fillStyle = '#888';
  ctx.fillRect(x + 14, y - 35, 14, 3);
  ctx.fillStyle = '#bbb';
  ctx.beginPath(); ctx.ellipse(x + 30, y - 34, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
}

function dibujarArbol(ctx, x, y) {
  ctx.fillStyle = '#5b3a2e';
  ctx.fillRect(x - 4, y - 30, 8, 30);
  ctx.fillStyle = '#4a9c30';
  ctx.beginPath(); ctx.arc(x, y - 40, 20, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6fc94c';
  ctx.beginPath(); ctx.arc(x - 8, y - 45, 12, 0, Math.PI * 2); ctx.arc(x + 8, y - 45, 12, 0, Math.PI * 2); ctx.fill();
}

function finPersecucion() {
  // Juana atrapó a papá
  mostrarPantalla('pantalla-reaccion');
  document.getElementById('cliente-reaccion').innerHTML = svgCliente(juego.clienteActual);
  document.getElementById('reaccion-texto').textContent = '¡LO ATRAPASTE! 🎉';
  document.getElementById('reaccion-frase').textContent =
    '"Está bien, está bien… me lo trago. Aquí está tu pago, chef ✨" 🪙';
  document.getElementById('papa-decide').classList.add('oculto');
  document.getElementById('boton-continuar').classList.remove('oculto');

  // Recompensa por atrapar
  juego.monedas += 15;
  juego.popularidad = Math.min(100, juego.popularidad + 5);
  juego.ventasNivel++;
  actualizarHUD();
}


/* ========== 10. HUD Y NIVELES ========== */

function actualizarHUD() {
  document.getElementById('hud-nivel').textContent = juego.nivel;
  document.getElementById('hud-monedas').textContent = juego.monedas;
  document.getElementById('barra-pop-fill').style.width = juego.popularidad + '%';
  document.getElementById('hud-nombre-tienda').textContent = juego.nombreTienda;
  document.getElementById('cartel-tienda').textContent =
    '🍦 ' + (juego.nombreTienda === 'Sin nombre' ? 'Heladería' : juego.nombreTienda);
}

function actualizarDecoracion() {
  // El nuevo HTML no tiene zona de decoración (la heladería ahora vive
  // en el área del cliente). Mantenemos la función como no-op para
  // futuras decoraciones.
  const deco = document.getElementById('deco-nivel');
  if (!deco) return;
  const datos = NIVELES_DATA[juego.nivel - 1];
  deco.innerHTML = '';
  if (datos.deco.includes('mesa'))  deco.innerHTML += '<div class="deco-mesa"></div>';
  if (datos.deco.includes('flor'))  deco.innerHTML += '<div class="deco-flor">🌸</div>';
  if (datos.deco.includes('luces')) deco.innerHTML += '<div class="deco-luces">✨🌟✨🌟✨</div>';
}

function subirDeNivel() {
  juego.nivel++;
  juego.ventasNivel = 0;
  const datos = NIVELES_DATA[juego.nivel - 1] || NIVELES_DATA[NIVELES_DATA.length - 1];

  if (typeof sonidoFanfare === 'function') sonidoFanfare();
  if (typeof flashColor === 'function') flashColor('rgba(255, 216, 102, 0.4)', 0.6);
  setTimeout(() => {
    if (typeof confeti === 'function') {
      confeti(window.innerWidth / 2, window.innerHeight / 3);
      setTimeout(() => confeti(window.innerWidth / 3, window.innerHeight / 2), 200);
      setTimeout(() => confeti(window.innerWidth * 2/3, window.innerHeight / 2), 400);
    }
  }, 100);

  if (juego.nivel === 3 && juego.nombreTienda === 'Sin nombre') {
    mostrarPantalla('pantalla-nombre');
    return;
  }

  document.getElementById('texto-celebracion').textContent =
    '¡Bienvenida al nivel ' + juego.nivel + '! Tu heladería es cada día más famosa.';
  document.getElementById('desbloqueos').textContent = '🎁 ' + datos.desbloqueo;
  mostrarPantalla('pantalla-subir-nivel');
}

function guardarNombre() {
  const nombre = document.getElementById('input-nombre-tienda').value.trim();
  juego.nombreTienda = nombre || 'Heladería Munra';
  actualizarHUD();
  const datos = NIVELES_DATA[juego.nivel - 1];
  document.getElementById('texto-celebracion').textContent =
    '¡Ahora se llama "' + juego.nombreTienda + '"! Tu heladería es famosa, llegan clientes nuevos.';
  document.getElementById('desbloqueos').textContent = '🎁 ' + datos.desbloqueo;
  mostrarPantalla('pantalla-subir-nivel');
}

function continuarJuego() {
  actualizarDecoracion();
  renderizarIngredientes();
  mostrarPantalla('pantalla-tienda');
  llegaCliente();
}


/* ========== 11. EVENTOS ========== */

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-accion]');
  if (!el) return;
  const accion = el.dataset.accion;

  // ===== LOGIN =====
  if (accion === 'elegir-perfil') {
    elegirPerfil(el.dataset.perfil);
    return;
  }
  if (accion === 'verificar-clave') { verificarClave(); return; }
  if (accion === 'cambiar-perfil')  { cambiarPerfil();  return; }

  // ===== JUEGO =====
  if (accion === 'empezar') empezarJuego();
  else if (accion === 'servir') servirHelado();
  else if (accion === 'limpiar-cono') limpiarCono();
  else if (accion === 'papa-delicioso') papaDecide(true);
  else if (accion === 'papa-puaj') papaDecide(false);
  else if (accion === 'siguiente-cliente') siguienteCliente();
  else if (accion === 'continuar-juego') continuarJuego();
  else if (accion === 'guardar-nombre') guardarNombre();

  // Tabs de categorías
  const tab = e.target.closest('.tab-pill, .tab');
  if (tab) {
    document.querySelectorAll('.tab-pill, .tab').forEach(t => t.classList.remove('activa'));
    tab.classList.add('activa');
    juego.categoriaActiva = tab.dataset.categoria;
    renderizarIngredientes();
  }
});

// Teclado
window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  persecucion.teclas[k] = true;

  // Enter en input de clave
  if (e.key === 'Enter' && document.activeElement &&
      document.activeElement.id === 'input-clave') {
    e.preventDefault();
    verificarClave();
    return;
  }

  // Papá decide con D / P
  const pantallaReac = document.getElementById('pantalla-reaccion');
  if (pantallaReac && pantallaReac.classList.contains('activa')) {
    const c = juego.clienteActual;
    const decideEl = document.getElementById('papa-decide');
    if (c?.decideHumano && decideEl && !decideEl.classList.contains('oculto')) {
      if (k === 'd') papaDecide(true);
      else if (k === 'p') papaDecide(false);
    }
  }

  // Prevenir scroll con flechas durante persecución
  const pantallaPers = document.getElementById('pantalla-persecucion');
  if (pantallaPers && pantallaPers.classList.contains('activa') && k.startsWith('arrow')) {
    e.preventDefault();
  }
}, { passive: false });

window.addEventListener('keyup', (e) => {
  persecucion.teclas[e.key.toLowerCase()] = false;
});
