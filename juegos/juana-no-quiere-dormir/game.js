/* ============================================================
   "Juana no quiere dormir" — Motor del juego
   ------------------------------------------------------------
   MVP funcional escrito en JavaScript puro + Canvas API.
   Inspirado en Pac-Man, con estética manga/kawaii nocturna.

   Organizado en bloques para que sea fácil escalar:
     1. Constantes y configuración
     2. Estado global del juego
     3. Mapas y niveles
     4. Entrada (teclado)
     5. Lógica de movimiento y colisiones
     6. IA de Papá
     7. Bucle principal (update + render)
     8. Dibujo kawaii (Juana, Papá, ítems, laberinto)
     9. Gestión de pantallas y eventos
   ============================================================ */


/* ========== 1. CONSTANTES Y CONFIGURACIÓN ========== */

const TILE = 40;                 // Tamaño de cada celda en píxeles
const COLS = 16;
const FILAS = 16;
const ANCHO = COLS * TILE;       // 640
const ALTO = FILAS * TILE;       // 640

const ESTADO = {
  MENU: 'menu',
  HISTORIA: 'historia',
  JUGANDO: 'jugando',
  PAUSA: 'pausa',
  DERROTA: 'derrota',
  VICTORIA: 'victoria',
  FINAL: 'final'
};

const DIRS = {
  ARRIBA:   { dx:  0, dy: -1, nombre: 'arriba' },
  ABAJO:    { dx:  0, dy:  1, nombre: 'abajo' },
  IZQUIERDA:{ dx: -1, dy:  0, nombre: 'izquierda' },
  DERECHA:  { dx:  1, dy:  0, nombre: 'derecha' }
};
const TODAS_DIRS = [DIRS.ARRIBA, DIRS.ABAJO, DIRS.IZQUIERDA, DIRS.DERECHA];

// Colores firma — calibrados a partir de las fotos reales de Juana y Juan
const COLORES = {
  noche:         '#0e1336',
  paredFondo:    '#1c2256',
  pared:         '#5b67c4',
  paredBorde:    '#8fa1ff',
  estrella:      '#ffd866',
  estrellaSombra:'#ff9b3d',
  cuento:        '#fff4dc',
  cuentoMarca:   '#ff7fb6',
  sopa:          '#c084fc',
  sopaGlow:      '#e9c2ff',

  // --- JUANA (calibrado a la referencia manga + foto) ---
  juanaPiel:     '#f4c69a',  // piel cálida bronceada
  juanaPelo:     '#4a2d1a',  // castaño oscuro chocolate (no claro)
  juanaPeloLuz:  '#7a4a2c',  // mechones más claros, da profundidad
  juanaRopa:     '#f7a7c4',  // camiseta rosa (de la foto real)
  juanaUnicornio:'#ffffff',
  juanaCuerno:   '#7fd8c8',
  juanaShorts:   '#1a8fbf',
  juanaShortsR:  '#0b5d80',
  juanaMejillas: '#ff9bbe',
  juanaLazo:     '#e83e3e',  // lacito rojo en las trenzas
  juanaLengua:   '#ff7fa3',

  // --- PAPÁ JUAN (de la foto) ---
  papaPiel:      '#f2c39c',  // piel cálida
  papaPelo:      '#1a1a22',  // pelo negro muy corto
  papaBarba:     '#33302e',  // barba cerrada gris oscuro
  papaRopa:      '#f4e8c8',  // camiseta crema cuello V
  papaCuelloV:   '#d9caa3',  // sombra del cuello V
  papaShorts:    '#3b3d44',  // pantaloneta gris oscura
  papaFlor:      '#9ea0a8',  // estampado floral claro
  papaScared:    '#95e1c1',  // versión "asustado" durante la sopa
};


/* ========== 2. ESTADO GLOBAL DEL JUEGO ========== */

const juego = {
  estado: ESTADO.MENU,
  nivelIndex: 0,
  vidas: 3,
  puntaje: 0,

  // Entidades
  mapa: null,         // matriz mutable de la celda actual (con coleccionables)
  juana: null,
  papa: null,
  coleccionables: 0,  // cuántos faltan

  // Sopa mágica / poder
  sopaActiva: false,
  sopaTiempoRestante: 0,    // en frames
  sopaDuracionInicial: 0,   // para mostrar barra

  // Poderes desbloqueados (persistentes en la partida)
  poderesJuana: [],
  poderesPapa: [],

  // Mensaje flotante
  mensajeTimer: 0,

  // Pausa entre vidas / respawn
  congeladoFrames: 0,

  // Para animaciones
  tiempo: 0,
};


/* ========== 3. MAPAS Y NIVELES ==========
   Leyenda:
     '#' = pared
     '.' = estrella
     'o' = cuento (libro)
     'S' = sopa mágica
     'J' = posición inicial de Juana
     'P' = posición inicial de Papá
     ' ' = pasillo vacío (sin coleccionable)
   Cada mapa debe ser 16 columnas x 16 filas.
*/

const MAPA_1 = [
  "################",
  "#J............P#",
  "#o####.##.####o#",
  "#.#..........#.#",
  "#.#.########.#.#",
  "#...#......#...#",
  "###.#.####.#.###",
  "#.....####.....#",
  "###.#.####.#.###",
  "#...#......#...#",
  "#.#.########.#.#",
  "#.#....S.....#.#",
  "#.####.##.####.#",
  "#oS..........So#",
  "#.####.##.####.#",
  "################",
];

// Para el MVP los demás niveles usan el mismo mapa con dificultad creciente.
// Más adelante podemos diseñar laberintos únicos por mundo.
// En modo 2 jugadores, partimos con velocidades iguales y vamos
// subiendo nivel a nivel. Las velocidades deben dividir TILE (40)
// para que el snap al centro sea limpio: 1, 2, 4, 5, 8, 10...
const NIVELES = [
  {
    nombre: 'La sala traviesa',
    mapa: MAPA_1,
    velocidadJuana: 4,
    velocidadPapa: 4,
    sopaDuracion: 8 * 60,
    poderDesbloqueado: 'Velocidad extra (Juana corre un poquito más rápido)',
    aplicarPoderJuana: (j) => { j.velocidad = 5; },
    poderPapaDesbloqueado: 'Rapidez (Papá corre un poquito más)',
    aplicarPoderPapa: (p) => { p.velocidad = 5; }
  },
  {
    nombre: 'El pasillo infinito',
    mapa: MAPA_1,
    velocidadJuana: 4,
    velocidadPapa: 4,
    sopaDuracion: 7 * 60,
    poderDesbloqueado: 'Escudo de almohada (sobrevives un golpe)',
    aplicarPoderJuana: (j) => { j.escudo = true; },
    poderPapaDesbloqueado: 'Aparición sorpresa (Papá renace más cerca)',
    aplicarPoderPapa: (p) => { p.aparicionCercana = true; }
  },
  {
    nombre: 'La cocina de la sopa mágica',
    mapa: MAPA_1,
    velocidadJuana: 5,
    velocidadPapa: 5,
    sopaDuracion: 9 * 60,
    poderDesbloqueado: 'Congelar a papá (la sopa lo paraliza más tiempo)',
    aplicarPoderJuana: (j) => { j.congelaMas = true; },
    poderPapaDesbloqueado: 'Bostezo gigante (te ralentiza al iniciar)',
    aplicarPoderPapa: (p) => { p.bostezo = true; }
  },
  {
    nombre: 'El cuarto encantado',
    mapa: MAPA_1,
    velocidadJuana: 5,
    velocidadPapa: 5,
    sopaDuracion: 8 * 60,
    poderDesbloqueado: 'Teletransporte corto (próximamente)',
    aplicarPoderJuana: (j) => { j.teletransporte = true; },
    poderPapaDesbloqueado: 'Trampa de sueño (próximamente)',
    aplicarPoderPapa: (p) => { p.trampa = true; }
  },
  {
    nombre: 'La batalla de la pijama final',
    mapa: MAPA_1,
    velocidadJuana: 5,
    velocidadPapa: 5,
    sopaDuracion: 6 * 60,
    poderDesbloqueado: '¡Juana se convirtió en leyenda nocturna!',
    aplicarPoderJuana: (j) => {},
    poderPapaDesbloqueado: 'Volar sobre paredes (próximamente)',
    aplicarPoderPapa: (p) => { p.volar = true; }
  }
];


/* ========== 4. UTILIDADES ========== */

function esCaminable(mapa, col, fila) {
  if (fila < 0 || fila >= FILAS || col < 0 || col >= COLS) return false;
  return mapa[fila][col] !== '#';
}

function puedeMoverDesde(col, fila, dir, mapa) {
  return esCaminable(mapa, col + dir.dx, fila + dir.dy);
}

function manhattan(c1, f1, c2, f2) {
  return Math.abs(c1 - c2) + Math.abs(f1 - f2);
}

function esDirOpuesta(a, b) {
  if (!a || !b) return false;
  return a.dx === -b.dx && a.dy === -b.dy;
}


/* ========== 5. CARGA DE NIVEL ========== */

function cargarNivel(index) {
  const nivel = NIVELES[index];

  // Copiamos el mapa para poder mutarlo (quitando coleccionables al recogerlos)
  juego.mapa = nivel.mapa.map(fila => fila.split(''));

  // Encontrar posiciones de Juana y Papá y contar coleccionables
  let total = 0;
  let posJuana = { col: 1, fila: 1 };
  let posPapa  = { col: COLS - 2, fila: 1 };

  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLS; c++) {
      const ch = juego.mapa[f][c];
      if (ch === 'J') {
        posJuana = { col: c, fila: f };
        juego.mapa[f][c] = ' ';
      } else if (ch === 'P') {
        posPapa = { col: c, fila: f };
        juego.mapa[f][c] = ' ';
      } else if (ch === '.' || ch === 'o') {
        total++;
      } else if (ch === 'S') {
        // La sopa no cuenta como coleccionable obligatorio
      }
    }
  }
  juego.coleccionables = total;

  // Crear entidades
  juego.juana = crearEntidad(posJuana.col, posJuana.fila, nivel.velocidadJuana, 'juana');
  juego.papa  = crearEntidad(posPapa.col,  posPapa.fila,  nivel.velocidadPapa,  'papa');

  // Aplicar poderes acumulados (desbloqueados en niveles previos)
  juego.poderesJuana.forEach(p => p.aplicar(juego.juana));
  juego.poderesPapa.forEach(p => p.aplicar(juego.papa));

  // Reset de estado del nivel
  juego.sopaActiva = false;
  juego.sopaTiempoRestante = 0;
  juego.sopaDuracionInicial = nivel.sopaDuracion;
  juego.congeladoFrames = 30;  // pequeño respiro al cargar

  actualizarHUD();
}

function crearEntidad(col, fila, velocidad, tipo) {
  return {
    tipo,
    col, fila,
    x: col * TILE,
    y: fila * TILE,
    dir: null,
    dirSiguiente: null,
    velocidad,
    velocidadOriginal: velocidad,
    inicioCol: col,
    inicioFila: fila,
    asustado: false,
    paralizadoFrames: 0,
    escudo: false,
    aparicionCercana: false,
    congelaMas: false,
    bostezo: false,
    teletransporte: false,
    trampa: false,
    volar: false,
    parpadeo: 0
  };
}


/* ========== 6. ENTRADA (TECLADO) ==========
   Modo 2 jugadores en el mismo teclado:
     - Juana usa las FLECHAS  (↑ ↓ ← →)
     - Papá usa WASD          (W A S D)
*/

const teclas = {};

window.addEventListener('keydown', (e) => {
  teclas[e.key] = true;
  const k = e.key.toLowerCase();

  // Tecla de pausa siempre activa (local solamente)
  if (k === 'p' && RED.modo === 'local') { togglePausa(); return; }

  if (juego.estado !== ESTADO.JUGANDO) return;

  // Detectar dirección desde flechas
  let dirFlechas = null;
  if (k === 'arrowup')    dirFlechas = DIRS.ARRIBA;
  if (k === 'arrowdown')  dirFlechas = DIRS.ABAJO;
  if (k === 'arrowleft')  dirFlechas = DIRS.IZQUIERDA;
  if (k === 'arrowright') dirFlechas = DIRS.DERECHA;

  if (RED.modo === 'local') {
    // ----- LOCAL: flechas → Juana, WASD → Papá -----
    if (dirFlechas && juego.juana) juego.juana.dirSiguiente = dirFlechas;
    if (juego.papa) {
      if (k === 'w') juego.papa.dirSiguiente = DIRS.ARRIBA;
      if (k === 's') juego.papa.dirSiguiente = DIRS.ABAJO;
      if (k === 'a') juego.papa.dirSiguiente = DIRS.IZQUIERDA;
      if (k === 'd') juego.papa.dirSiguiente = DIRS.DERECHA;
    }
  } else if (RED.modo === 'online_host') {
    // ----- HOST: flechas controlan MI personaje -----
    if (dirFlechas) {
      const yo = RED.miRol === 'juana' ? juego.juana : juego.papa;
      if (yo) yo.dirSiguiente = dirFlechas;
    }
  } else if (RED.modo === 'online_cliente') {
    // ----- CLIENTE: flechas se mandan al host -----
    if (dirFlechas) enviarInput(dirFlechas.nombre);
  }

  if (k.startsWith('arrow') || k === ' ') e.preventDefault();
}, { passive: false });

window.addEventListener('keyup', (e) => { teclas[e.key] = false; });


/* ========== 7. MOVIMIENTO Y COLISIONES ========== */

function actualizarEntidad(ent, mapa) {
  if (ent.paralizadoFrames > 0) {
    ent.paralizadoFrames--;
    return;
  }

  // Mover en la dirección actual
  if (ent.dir) {
    ent.x += ent.dir.dx * ent.velocidad;
    ent.y += ent.dir.dy * ent.velocidad;
  }

  // Verificar si llegamos al centro de una celda
  const ccol = Math.round(ent.x / TILE);
  const cfila = Math.round(ent.y / TILE);
  const cx = ccol * TILE;
  const cy = cfila * TILE;

  const cercaCentro = Math.abs(ent.x - cx) < ent.velocidad &&
                      Math.abs(ent.y - cy) < ent.velocidad;

  if (cercaCentro) {
    // Snap al centro
    ent.x = cx;
    ent.y = cy;
    ent.col = ccol;
    ent.fila = cfila;

    // Intentar aplicar dirección deseada (queue)
    if (ent.dirSiguiente && puedeMoverDesde(ent.col, ent.fila, ent.dirSiguiente, mapa)) {
      ent.dir = ent.dirSiguiente;
      ent.dirSiguiente = null;
    }
    // Si la dirección actual ya no es válida, detenerse
    if (!ent.dir || !puedeMoverDesde(ent.col, ent.fila, ent.dir, mapa)) {
      ent.dir = null;
    }
  }
}


/* ========== 8. IA DE PAPÁ ==========
   Estrategia sencilla:
   - En cada centro de celda, decidir nueva dirección.
   - Si Papá está asustado (sopa activa): elegir la dirección que
     más lejos lo lleve de Juana, sin retroceder.
   - Si no, elegir la dirección que más lo acerque a Juana.
   - Evita reversa salvo en callejones sin salida.
*/

function decidirIAPapa() {
  const papa = juego.papa;
  const juana = juego.juana;
  const mapa = juego.mapa;

  // Solo decidir cuando está exactamente sobre el centro de una celda
  if (papa.x !== papa.col * TILE || papa.y !== papa.fila * TILE) return;

  const opciones = TODAS_DIRS.filter(d =>
    puedeMoverDesde(papa.col, papa.fila, d, mapa) &&
    !esDirOpuesta(d, papa.dir)
  );

  let elegida;
  if (opciones.length === 0) {
    // Callejón sin salida: devolverse
    elegida = TODAS_DIRS.find(d => esDirOpuesta(d, papa.dir));
  } else if (opciones.length === 1) {
    elegida = opciones[0];
  } else {
    // Varias opciones: ordenar por distancia
    const scored = opciones.map(d => {
      const nc = papa.col + d.dx;
      const nf = papa.fila + d.dy;
      return { d, dist: manhattan(nc, nf, juana.col, juana.fila) };
    });
    scored.sort((a, b) => papa.asustado ? b.dist - a.dist : a.dist - b.dist);
    elegida = scored[0].d;
  }

  if (elegida) papa.dir = elegida;
}


/* ========== 9. LÓGICA DE COLECCIONABLES Y SOPA ========== */

function recogerEnTilesActuales() {
  const j = juego.juana;
  if (j.x !== j.col * TILE || j.y !== j.fila * TILE) return;

  const celda = juego.mapa[j.fila][j.col];

  if (celda === '.') {
    juego.mapa[j.fila][j.col] = ' ';
    juego.puntaje += 10;
    juego.coleccionables--;
  } else if (celda === 'o') {
    juego.mapa[j.fila][j.col] = ' ';
    juego.puntaje += 25;
    juego.coleccionables--;
    mostrarMensaje('📖 ¡Cuento mágico!');
  } else if (celda === 'S') {
    juego.mapa[j.fila][j.col] = ' ';
    juego.puntaje += 50;
    activarSopaMagica();
    mostrarMensaje('✨ ¡Sopa mágica! ✨');
  }
}

function activarSopaMagica() {
  juego.sopaActiva = true;
  let duracion = NIVELES[juego.nivelIndex].sopaDuracion;
  if (juego.juana.congelaMas) duracion = Math.round(duracion * 1.3);
  juego.sopaDuracionInicial = duracion;
  juego.sopaTiempoRestante = duracion;
  juego.papa.asustado = true;
}

function actualizarSopa() {
  if (!juego.sopaActiva) return;
  juego.sopaTiempoRestante--;
  if (juego.sopaTiempoRestante <= 0) {
    juego.sopaActiva = false;
    juego.papa.asustado = false;
  }
}

function chequearColisionJuanaPapa() {
  const j = juego.juana, p = juego.papa;
  // Colisión por proximidad de centros
  const dist = Math.hypot(j.x - p.x, j.y - p.y);
  if (dist > TILE * 0.7) return;

  if (juego.sopaActiva && p.asustado) {
    // Juana atrapa a Papá → Papá se va a casa
    juego.puntaje += 200;
    mostrarMensaje('💖 ¡Atrapaste a papá!');
    let paralisis = 120;
    if (j.congelaMas) paralisis = 180;
    p.col = p.inicioCol; p.fila = p.inicioFila;
    p.x = p.col * TILE; p.y = p.fila * TILE;
    p.dir = null; p.dirSiguiente = null;
    p.paralizadoFrames = paralisis;
  } else {
    // Papá atrapa a Juana
    if (j.escudo) {
      j.escudo = false;
      mostrarMensaje('🛡️ ¡El escudo te salvó!');
      reposicionarTrasGolpe();
      return;
    }
    juego.vidas--;
    actualizarHUD();
    if (juego.vidas <= 0) {
      perderJuego();
    } else {
      mostrarMensaje('😵 ¡Casi te atrapa!');
      reposicionarTrasGolpe();
    }
  }
}

function reposicionarTrasGolpe() {
  juego.juana.col = juego.juana.inicioCol;
  juego.juana.fila = juego.juana.inicioFila;
  juego.juana.x = juego.juana.col * TILE;
  juego.juana.y = juego.juana.fila * TILE;
  juego.juana.dir = null;
  juego.juana.dirSiguiente = null;

  juego.papa.col = juego.papa.inicioCol;
  juego.papa.fila = juego.papa.inicioFila;
  if (juego.papa.aparicionCercana) {
    // Aparece a 4 celdas de Juana
    // Por ahora simplemente lo dejamos en su sitio inicial
  }
  juego.papa.x = juego.papa.col * TILE;
  juego.papa.y = juego.papa.fila * TILE;
  juego.papa.dir = null;
  juego.papa.dirSiguiente = null;
  juego.papa.asustado = false;
  juego.sopaActiva = false;
  juego.congeladoFrames = 45;
}


/* ========== 10. ESTADOS DE FIN DE PARTIDA ========== */

function perderJuego() {
  juego.estado = ESTADO.DERROTA;
  // Papá desbloquea un poder nuevo
  const nivel = NIVELES[juego.nivelIndex];
  const yaTiene = juego.poderesPapa.find(p => p.nombre === nivel.poderPapaDesbloqueado);
  if (!yaTiene) {
    juego.poderesPapa.push({
      nombre: nivel.poderPapaDesbloqueado,
      aplicar: nivel.aplicarPoderPapa
    });
  }
  document.getElementById('poder-papa-nuevo').textContent =
    'Papá desbloqueó: ' + nivel.poderPapaDesbloqueado;
  mostrarPantalla('pantalla-derrota');
}

function ganarNivel() {
  juego.estado = ESTADO.VICTORIA;
  const nivel = NIVELES[juego.nivelIndex];
  juego.poderesJuana.push({
    nombre: nivel.poderDesbloqueado,
    aplicar: nivel.aplicarPoderJuana
  });
  juego.puntaje += 500;

  document.getElementById('poder-juana-nuevo').textContent =
    'Juana desbloqueó: ' + nivel.poderDesbloqueado;

  // Si era el último nivel → pantalla final
  if (juego.nivelIndex >= NIVELES.length - 1) {
    juego.estado = ESTADO.FINAL;
    mostrarPantalla('pantalla-final');
  } else {
    mostrarPantalla('pantalla-victoria');
  }
}


/* ========== 11. BUCLE PRINCIPAL ========== */

const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');

function loop() {
  juego.tiempo++;

  // ----- CLIENTE: solo renderizar el estado recibido del host -----
  if (RED.modo === 'online_cliente') {
    aplicarEstadoRemoto();
    render();
    requestAnimationFrame(loop);
    return;
  }

  // ----- LOCAL u HOST: correr lógica completa -----
  if (juego.estado === ESTADO.JUGANDO) {
    if (juego.congeladoFrames > 0) {
      juego.congeladoFrames--;
    } else {
      // Si soy HOST y tengo input remoto pendiente, aplícalo al personaje opuesto
      if (RED.modo === 'online_host' && RED.inputRemoto) {
        const opuesto = RED.miRol === 'juana' ? juego.papa : juego.juana;
        const dirObj = TODAS_DIRS.find(d => d.nombre === RED.inputRemoto);
        if (opuesto && dirObj) opuesto.dirSiguiente = dirObj;
        RED.inputRemoto = null;
      }

      actualizarEntidad(juego.juana, juego.mapa);
      actualizarEntidad(juego.papa, juego.mapa);
      recogerEnTilesActuales();
      actualizarSopa();
      chequearColisionJuanaPapa();
      if (juego.coleccionables <= 0) {
        ganarNivel();
      }
      actualizarHUD();
    }

    // Broadcast del estado a 30fps si soy HOST
    if (RED.modo === 'online_host') broadcastEstado(juego);
  }
  render();
  requestAnimationFrame(loop);
}

/* ----- CLIENTE: aplica el snapshot recibido del HOST ----- */
function aplicarEstadoRemoto() {
  const s = RED.estadoRemoto;
  if (!s) return;

  juego.estado = s.estado;
  juego.nivelIndex = s.nivelIndex;
  juego.puntaje = s.puntaje;
  juego.vidas = s.vidas;
  juego.coleccionables = s.coleccionables;
  juego.sopaActiva = s.sopaActiva;
  juego.sopaTiempoRestante = s.sopaTiempoRestante;
  juego.mapa = s.mapa;

  if (!juego.juana) juego.juana = crearEntidad(s.juana.col, s.juana.fila, 4, 'juana');
  if (!juego.papa)  juego.papa  = crearEntidad(s.papa.col,  s.papa.fila,  4, 'papa');

  juego.juana.x = s.juana.x; juego.juana.y = s.juana.y;
  juego.juana.col = s.juana.col; juego.juana.fila = s.juana.fila;
  juego.juana.dir = s.juana.dir ? TODAS_DIRS.find(d => d.nombre === s.juana.dir) : null;
  juego.juana.escudo = s.juana.escudo;

  juego.papa.x = s.papa.x; juego.papa.y = s.papa.y;
  juego.papa.col = s.papa.col; juego.papa.fila = s.papa.fila;
  juego.papa.dir = s.papa.dir ? TODAS_DIRS.find(d => d.nombre === s.papa.dir) : null;
  juego.papa.asustado = s.papa.asustado;
  juego.papa.paralizadoFrames = s.papa.paralizadoFrames;

  // Detectar transición a victoria/derrota desde el host
  if (s.estado === ESTADO.DERROTA) mostrarPantalla('pantalla-derrota');
  if (s.estado === ESTADO.VICTORIA) mostrarPantalla('pantalla-victoria');
  if (s.estado === ESTADO.FINAL)    mostrarPantalla('pantalla-final');

  actualizarHUD();
}


/* ========== 12. DIBUJO (RENDER) ========== */

function render() {
  // Fondo
  ctx.fillStyle = COLORES.noche;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  if (!juego.mapa) return;

  dibujarLaberinto();
  dibujarColeccionables();
  dibujarPapa(juego.papa);
  dibujarJuana(juego.juana);

  // Efecto de "pulso" suave en pantalla cuando sopa activa
  if (juego.sopaActiva) {
    const alpha = 0.06 + Math.sin(juego.tiempo * 0.1) * 0.04;
    ctx.fillStyle = `rgba(192, 132, 252, ${alpha})`;
    ctx.fillRect(0, 0, ANCHO, ALTO);
  }
}

function dibujarLaberinto() {
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLS; c++) {
      if (juego.mapa[f][c] === '#') {
        dibujarPared(c, f);
      }
    }
  }
}

function dibujarPared(c, f) {
  const x = c * TILE, y = f * TILE;
  // Borde exterior suave
  ctx.fillStyle = COLORES.paredFondo;
  ctx.fillRect(x, y, TILE, TILE);

  // Bloque redondeado kawaii
  const margen = 4;
  ctx.fillStyle = COLORES.pared;
  redondeado(x + margen, y + margen, TILE - margen * 2, TILE - margen * 2, 8);
  ctx.fill();

  // Brillo superior
  ctx.fillStyle = COLORES.paredBorde;
  redondeado(x + margen + 2, y + margen + 2, TILE - margen * 2 - 4, 4, 3);
  ctx.fill();
}

function dibujarColeccionables() {
  const t = juego.tiempo;
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLS; c++) {
      const ch = juego.mapa[f][c];
      const x = c * TILE + TILE / 2;
      const y = f * TILE + TILE / 2;
      if (ch === '.') dibujarEstrella(x, y, t, 0.55);
      else if (ch === 'o') dibujarCuento(x, y, t);
      else if (ch === 'S') dibujarSopa(x, y, t);
    }
  }
}

function dibujarEstrella(x, y, t, escala) {
  const pulso = 1 + Math.sin(t * 0.15 + x) * 0.08;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(escala * pulso, escala * pulso);
  // Brillo
  ctx.shadowColor = COLORES.estrella;
  ctx.shadowBlur = 12;
  estrella5(0, 0, 8, 4);
  ctx.fillStyle = COLORES.estrella;
  ctx.fill();
  ctx.restore();
}

function dibujarCuento(x, y, t) {
  const flot = Math.sin(t * 0.08 + x) * 1.2;
  ctx.save();
  ctx.translate(x, y + flot);
  // Cuerpo del libro
  ctx.fillStyle = COLORES.cuento;
  redondeado(-10, -8, 20, 16, 3);
  ctx.fill();
  // Lomo
  ctx.fillStyle = COLORES.cuentoMarca;
  ctx.fillRect(-10, -8, 3, 16);
  // Líneas de texto
  ctx.fillStyle = '#bba37e';
  ctx.fillRect(-5, -4, 12, 1);
  ctx.fillRect(-5,  0, 12, 1);
  ctx.fillRect(-5,  4, 8,  1);
  ctx.restore();
}

function dibujarSopa(x, y, t) {
  const pulso = 1 + Math.sin(t * 0.12) * 0.12;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pulso, pulso);
  // Aura
  const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
  grad.addColorStop(0, 'rgba(233, 194, 255, 0.6)');
  grad.addColorStop(1, 'rgba(192, 132, 252, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();
  // Cuenco
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(0, 6, 13, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORES.sopa;
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI, false);
  ctx.fill();
  // Burbujas
  ctx.fillStyle = COLORES.sopaGlow;
  ctx.beginPath();
  ctx.arc(-3, -2, 2, 0, Math.PI * 2);
  ctx.arc( 4,  0, 1.5, 0, Math.PI * 2);
  ctx.arc( 1, -4, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* =====================================================
   PERSONAJES estilo chibi-manga.
   Proporciones: cabeza ENORME (estilo Hat Kid / Persona Q),
   cuerpo pequeño abajo. Halo de color firma + nametag para
   distinguirlos siempre, incluso en movimiento rápido.
   ===================================================== */

function dibujarHaloYNombre(x, y, color, nombre) {
  // Halo en el piso
  const grad = ctx.createRadialGradient(0, 16, 2, 0, 16, 24);
  grad.addColorStop(0, color + 'cc');
  grad.addColorStop(1, color + '00');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 16, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nametag flotante arriba del personaje
  ctx.save();
  const w = ctx.measureText(nombre).width + 10;
  ctx.font = 'bold 9px "Comic Sans MS", system-ui, sans-serif';
  ctx.fillStyle = color;
  redondeado(-w / 2, -28, w, 11, 5);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(nombre, 0, -22.5);
  ctx.restore();
}

/*  Dibujo de Juana basado en la foto real:
    - Pelo castaño claro rizado con dos trenzas largas
    - Camiseta rosa con estampado de unicornio
    - Shorts azules con rayas oscuras
    - Estilo chibi: cabeza muy grande, ojos manga brillantes
*/
function dibujarJuana(j) {
  ctx.save();
  ctx.translate(j.x + TILE / 2, j.y + TILE / 2);

  // Halo rosa + nametag (siempre visibles para identificar)
  dibujarHaloYNombre(0, 0, '#ff4f9c', 'JUANA');

  // Bounce sutil al caminar
  const bounce = j.dir ? Math.sin(juego.tiempo * 0.45) * 0.8 : 0;
  ctx.translate(0, bounce);

  // ===== CUERPO CHIBI (pequeño debajo de la cabeza enorme) =====
  // Shorts azules a rayas
  ctx.fillStyle = COLORES.juanaShorts;
  redondeado(-8, 9, 16, 7, 3);
  ctx.fill();
  ctx.fillStyle = COLORES.juanaShortsR;
  ctx.fillRect(-8, 11, 16, 1.4);
  ctx.fillRect(-8, 14, 16, 1.4);

  // Camiseta rosa con borde marcado
  ctx.fillStyle = COLORES.juanaRopa;
  redondeado(-9, 3, 18, 8, 3);
  ctx.fill();
  // Mini-unicornio en el pecho
  ctx.fillStyle = COLORES.juanaUnicornio;
  ctx.beginPath();
  ctx.arc(0, 7, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORES.juanaCuerno;
  ctx.fillRect(-0.5, 5, 1, 1.4);

  // Bracitos
  ctx.fillStyle = COLORES.juanaPiel;
  ctx.beginPath();
  ctx.arc(-9, 6, 2.2, 0, Math.PI * 2);
  ctx.arc( 9, 6, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // ===== CABEZA GRANDE estilo chibi =====
  // Outline oscuro para que destaque sobre cualquier fondo
  ctx.fillStyle = '#3a1e10';
  ctx.beginPath();
  ctx.arc(0, -5, 14.5, 0, Math.PI * 2);
  ctx.fill();
  // Piel
  ctx.fillStyle = COLORES.juanaPiel;
  ctx.beginPath();
  ctx.arc(0, -5, 13.5, 0, Math.PI * 2);
  ctx.fill();

  // ===== Cabello castaño claro =====
  // Casco superior (cubre la mitad de la cabeza)
  ctx.fillStyle = COLORES.juanaPelo;
  ctx.beginPath();
  ctx.arc(0, -6, 14, Math.PI, Math.PI * 2);
  // Bajar un poco a los lados
  ctx.lineTo(14, -2);
  ctx.lineTo(-14, -2);
  ctx.closePath();
  ctx.fill();

  // Mechones rizados sobre la frente
  ctx.fillStyle = COLORES.juanaPeloLuz;
  ctx.beginPath();
  ctx.arc(-7, -10, 3.2, 0, Math.PI * 2);
  ctx.arc(-1, -12, 3.4, 0, Math.PI * 2);
  ctx.arc( 6, -10, 3.2, 0, Math.PI * 2);
  ctx.fill();
  // Pequeño rizo en la frente
  ctx.fillStyle = COLORES.juanaPelo;
  ctx.beginPath();
  ctx.arc(-3, -8, 1.6, 0, Math.PI * 2);
  ctx.arc( 3, -8, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // ===== Trenzas a los lados (más grandes y notorias) =====
  const trenza = (lx, sign) => {
    // Base unión
    ctx.fillStyle = COLORES.juanaPelo;
    ctx.beginPath();
    ctx.arc(lx, -3, 4, 0, Math.PI * 2);
    ctx.fill();
    // Cuerpo de la trenza con segmentos
    ctx.beginPath();
    ctx.ellipse(lx + sign * 1, 1, 3.8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORES.juanaPeloLuz;
    ctx.beginPath();
    ctx.ellipse(lx + sign * 1.5, 4, 3, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Lacito ROJO en la punta (como en la referencia manga)
    ctx.fillStyle = COLORES.juanaLazo;
    ctx.beginPath();
    ctx.arc(lx + sign * 2, 7, 2.2, 0, Math.PI * 2);
    ctx.fill();
    // Brillito del lazo
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(lx + sign * 1.5, 6.4, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  trenza(-13, -1);
  trenza( 13,  1);

  // ===== CEJAS MARCADAS (rasgo clave del estilo manga ref.) =====
  ctx.strokeStyle = COLORES.juanaPelo;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-7.5, -8); ctx.quadraticCurveTo(-4.5, -9, -1.5, -8);
  ctx.moveTo( 7.5, -8); ctx.quadraticCurveTo( 4.5, -9,  1.5, -8);
  ctx.stroke();

  // ===== OJOS MANGA GRANDES (cafés con brillos prominentes) =====
  const parpadea = (juego.tiempo % 240) < 5;
  if (parpadea) {
    ctx.strokeStyle = '#241a14';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-7, -4); ctx.lineTo(-2, -4);
    ctx.moveTo( 2, -4); ctx.lineTo( 7, -4);
    ctx.stroke();
  } else {
    // Sclera blanca grande
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-4.5, -4, 3.4, 4.2, 0, 0, Math.PI * 2);
    ctx.ellipse( 4.5, -4, 3.4, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Iris café grande
    ctx.fillStyle = '#5b3520';
    ctx.beginPath();
    ctx.arc(-4.5, -3.5, 2.6, 0, Math.PI * 2);
    ctx.arc( 4.5, -3.5, 2.6, 0, Math.PI * 2);
    ctx.fill();
    // Iris café claro interior (degradado manga)
    ctx.fillStyle = '#8a5b3a';
    ctx.beginPath();
    ctx.arc(-4.5, -3, 1.8, 0, Math.PI * 2);
    ctx.arc( 4.5, -3, 1.8, 0, Math.PI * 2);
    ctx.fill();
    // Pupila
    ctx.fillStyle = '#1a0a05';
    ctx.beginPath();
    ctx.arc(-4.5, -3.5, 1.2, 0, Math.PI * 2);
    ctx.arc( 4.5, -3.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
    // Brillos manga grandes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-3.4, -4.8, 1.2, 0, Math.PI * 2);
    ctx.arc( 5.6, -4.8, 1.2, 0, Math.PI * 2);
    ctx.fill();
    // Brillo secundario abajo
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(-5.2, -2.2, 0.6, 0, Math.PI * 2);
    ctx.arc( 3.8, -2.2, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // Línea superior del ojo + pestañas pequeñas
    ctx.strokeStyle = '#241a14';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(-4.5, -4, 3.4, Math.PI * 1.05, Math.PI * 1.95);
    ctx.arc( 4.5, -4, 3.4, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
    // Pestañas en las esquinas
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-7.8, -5); ctx.lineTo(-9, -6);
    ctx.moveTo( 7.8, -5); ctx.lineTo( 9, -6);
    ctx.stroke();
  }

  // Mejillas rosadas grandes
  ctx.fillStyle = COLORES.juanaMejillas;
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  ctx.arc(-7, 1, 2.4, 0, Math.PI * 2);
  ctx.arc( 7, 1, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // ===== Boca PÍCARA con lengüita asomando =====
  // (rasgo distintivo de las referencias manga que diste)
  ctx.fillStyle = '#3a1e10';
  redondeado(-2.8, 1, 5.6, 2.3, 1.1);
  ctx.fill();
  // Lengüita rosada asomando
  ctx.fillStyle = COLORES.juanaLengua;
  redondeado(-1.2, 2.8, 2.4, 1.4, 0.7);
  ctx.fill();
  // Dientito asomando arriba
  ctx.fillStyle = '#fff';
  ctx.fillRect(-0.7, 1.2, 1.4, 0.9);

  // Indicador de escudo de almohada
  if (j.escudo) {
    ctx.strokeStyle = 'rgba(255, 216, 102, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -2, 20 + Math.sin(juego.tiempo * 0.2) * 1.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/*  Papá Juan en estilo chibi-manga, basado en la foto real:
    - Pelo negro muy corto, barba cerrada gris-oscura
    - Camiseta crema cuello en V
    - Pantaloneta gris floral
    - Cabeza grande, ojos manga, mirada cariñosa
*/
function dibujarPapa(p) {
  ctx.save();
  ctx.translate(p.x + TILE / 2, p.y + TILE / 2);

  const asustado = p.asustado && juego.sopaActiva;
  const parpadeoFinal = asustado && juego.sopaTiempoRestante < 120 &&
                        Math.floor(juego.tiempo / 8) % 2 === 0;

  // Halo azul / verde (cuando asustado) + nametag
  const halo = (asustado && !parpadeoFinal) ? '#37b388' : '#3d7ab8';
  dibujarHaloYNombre(0, 0, halo, asustado ? '¡PAPÁ!' : 'PAPÁ');

  const bounce = p.dir ? Math.sin(juego.tiempo * 0.4 + 1.3) * 0.8 : 0;
  ctx.translate(0, bounce);

  const colorRopa = (asustado && !parpadeoFinal) ? COLORES.papaScared : COLORES.papaRopa;

  // ===== Pantaloneta floral =====
  ctx.fillStyle = COLORES.papaShorts;
  redondeado(-9, 9, 18, 7, 3);
  ctx.fill();
  ctx.fillStyle = COLORES.papaFlor;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(-5, 11, 1.4, 0, Math.PI * 2);
  ctx.arc( 0, 13, 1.2, 0, Math.PI * 2);
  ctx.arc( 5, 11, 1.4, 0, Math.PI * 2);
  ctx.arc(-3, 14, 1.0, 0, Math.PI * 2);
  ctx.arc( 4, 14, 1.0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // ===== Camiseta crema cuello V =====
  ctx.fillStyle = colorRopa;
  redondeado(-10, 3, 20, 8, 3);
  ctx.fill();
  // Cuello V
  ctx.fillStyle = COLORES.papaPiel;
  ctx.beginPath();
  ctx.moveTo(-3, 3);
  ctx.lineTo(0, 7);
  ctx.lineTo(3, 3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = COLORES.papaCuelloV;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-3, 3); ctx.lineTo(0, 7); ctx.lineTo(3, 3);
  ctx.stroke();

  // Brazos
  ctx.fillStyle = COLORES.papaPiel;
  ctx.beginPath();
  ctx.arc(-10, 6, 2.4, 0, Math.PI * 2);
  ctx.arc( 10, 6, 2.4, 0, Math.PI * 2);
  ctx.fill();

  // ===== CABEZA GRANDE chibi =====
  // Outline
  ctx.fillStyle = '#241818';
  ctx.beginPath();
  ctx.arc(0, -5, 15, 0, Math.PI * 2);
  ctx.fill();
  // Piel
  ctx.fillStyle = COLORES.papaPiel;
  ctx.beginPath();
  ctx.arc(0, -5, 14, 0, Math.PI * 2);
  ctx.fill();

  // ===== Pelo negro DESPEINADO con mechones (ref. manga) =====
  ctx.fillStyle = COLORES.papaPelo;
  // Base del cabello
  ctx.beginPath();
  ctx.arc(0, -6, 14, Math.PI, Math.PI * 2);
  ctx.lineTo(14, -4);
  ctx.lineTo(-14, -4);
  ctx.closePath();
  ctx.fill();
  // Mechones de punta hacia arriba (5 picos asimétricos)
  ctx.beginPath();
  // Pico izquierdo
  ctx.moveTo(-11, -14);
  ctx.lineTo(-9,  -19);
  ctx.lineTo(-6,  -15);
  // Pico centro-izq
  ctx.lineTo(-3,  -20);
  ctx.lineTo( 0,  -16);
  // Pico centro-der
  ctx.lineTo( 3,  -19);
  ctx.lineTo( 6,  -15);
  // Pico der
  ctx.lineTo( 9,  -18);
  ctx.lineTo( 11, -14);
  ctx.closePath();
  ctx.fill();
  // Mechón rebelde sobre la frente
  ctx.beginPath();
  ctx.moveTo(-5, -10);
  ctx.quadraticCurveTo(-2, -14, 1, -9);
  ctx.lineTo(-2, -8);
  ctx.closePath();
  ctx.fill();

  // ===== OJOS =====
  if (asustado) {
    ctx.strokeStyle = '#1a1428';
    ctx.lineWidth = 1.5;
    [[-5, -4], [5, -4]].forEach(([ex, ey]) => {
      // Ojo asustado grande
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ex, ey, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1a1428';
      ctx.beginPath();
      ctx.arc(ex, ey, 3, 0, Math.PI * 2);
      ctx.stroke();
      // Pupila pequeña temblorosa
      ctx.fillStyle = '#1a1428';
      ctx.beginPath();
      ctx.arc(ex + Math.sin(juego.tiempo*0.5)*0.5,
              ey + Math.cos(juego.tiempo*0.5)*0.5, 0.9, 0, Math.PI * 2);
      ctx.fill();
    });
    // Boca de susto (O)
    ctx.fillStyle = '#1a1428';
    ctx.beginPath();
    ctx.ellipse(0, 1, 1.4, 1.8 + Math.sin(juego.tiempo*0.3)*0.4, 0, 0, Math.PI*2);
    ctx.fill();
    // Gotita de sudor
    ctx.fillStyle = '#7fd0ff';
    ctx.beginPath();
    ctx.arc(8, -3, 1.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // ===== CEJAS GRUESAS (rasgo clave de Papá en la ref. manga) =====
    ctx.fillStyle = COLORES.papaPelo;
    ctx.beginPath();
    ctx.moveTo(-8, -8.5);
    ctx.quadraticCurveTo(-5, -9.8, -2, -8.5);
    ctx.lineTo(-2, -7.3);
    ctx.quadraticCurveTo(-5, -8, -8, -7.5);
    ctx.closePath();
    ctx.moveTo( 8, -8.5);
    ctx.quadraticCurveTo( 5, -9.8,  2, -8.5);
    ctx.lineTo( 2, -7.3);
    ctx.quadraticCurveTo( 5, -8,    8, -7.5);
    ctx.closePath();
    ctx.fill();

    // Sclera blanca grande estilo manga
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-5, -4, 3.4, 4.2, 0, 0, Math.PI * 2);
    ctx.ellipse( 5, -4, 3.4, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Iris café oscuro
    ctx.fillStyle = '#4a2d1a';
    ctx.beginPath();
    ctx.arc(-5, -3.5, 2.5, 0, Math.PI * 2);
    ctx.arc( 5, -3.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Iris café claro (degradado)
    ctx.fillStyle = '#7a4a2c';
    ctx.beginPath();
    ctx.arc(-5, -3, 1.7, 0, Math.PI * 2);
    ctx.arc( 5, -3, 1.7, 0, Math.PI * 2);
    ctx.fill();
    // Pupila
    ctx.fillStyle = '#1a0a05';
    ctx.beginPath();
    ctx.arc(-5, -3.5, 1.2, 0, Math.PI * 2);
    ctx.arc( 5, -3.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
    // Brillos manga grandes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-3.8, -4.8, 1.1, 0, Math.PI * 2);
    ctx.arc( 6.2, -4.8, 1.1, 0, Math.PI * 2);
    ctx.fill();
    // Brillo secundario
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(-5.5, -2.2, 0.5, 0, Math.PI * 2);
    ctx.arc( 4.5, -2.2, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // Línea superior marcada
    ctx.strokeStyle = '#241a14';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(-5, -4, 3.4, Math.PI * 1.05, Math.PI * 1.95);
    ctx.arc( 5, -4, 3.4, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
  }

  // ===== Barba cerrada grande =====
  ctx.fillStyle = COLORES.papaBarba;
  ctx.globalAlpha = 0.9;
  // Bigote
  redondeado(-4.5, -2, 9, 1.8, 0.8);
  ctx.fill();
  // Mentón / barba
  ctx.beginPath();
  ctx.arc(0, 1, 6.5, 0, Math.PI);
  ctx.fill();
  // Patillas
  ctx.beginPath();
  ctx.arc(-9, -1, 3, 0, Math.PI * 2);
  ctx.arc( 9, -1, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // ===== Sonrisa AMPLIA mostrando dientes (ref. manga) =====
  if (!asustado) {
    // Boca abierta
    ctx.fillStyle = '#2a0e08';
    redondeado(-3.2, 0.5, 6.4, 2.6, 1.2);
    ctx.fill();
    // Dientes blancos
    ctx.fillStyle = '#fff';
    redondeado(-2.6, 0.9, 5.2, 1.4, 0.4);
    ctx.fill();
    // División sutil entre dientes
    ctx.strokeStyle = '#c8b8a8';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, 0.9); ctx.lineTo(0, 2.3);
    ctx.stroke();
  }

  // ===== Tatuaje pequeño en el brazo (detalle de la ref.) =====
  if (!asustado) {
    ctx.fillStyle = COLORES.papaPelo;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(12, 7, 0.8, 0, Math.PI * 2);
    ctx.arc(11, 5.5, 0.6, 0, Math.PI * 2);
    ctx.arc(13, 5.5, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}


/* ========== 13. HELPERS DE DIBUJO ========== */

function redondeado(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function estrella5(cx, cy, rOut, rIn) {
  const puntas = 5;
  ctx.beginPath();
  for (let i = 0; i < puntas * 2; i++) {
    const r = (i % 2 === 0) ? rOut : rIn;
    const ang = (Math.PI / puntas) * i - Math.PI / 2;
    const x = cx + Math.cos(ang) * r;
    const y = cy + Math.sin(ang) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}


/* ========== 14. UI / HUD / PANTALLAS ========== */


/* ========== 14. UI / HUD / PANTALLAS ========== */

function actualizarHUD() {
  document.getElementById('hud-nivel').textContent = juego.nivelIndex + 1;
  document.getElementById('hud-nivel-nombre').textContent =
    NIVELES[juego.nivelIndex].nombre;
  document.getElementById('hud-puntaje').textContent = juego.puntaje;
  document.getElementById('hud-vidas').textContent =
    '♥ '.repeat(Math.max(juego.vidas, 0)).trim();

  const sopa = document.getElementById('hud-sopa');
  if (juego.sopaActiva) {
    const seg = Math.ceil(juego.sopaTiempoRestante / 60);
    sopa.textContent = '✨ ' + seg + 's';
    sopa.style.color = '#c084fc';
  } else {
    sopa.textContent = '—';
    sopa.style.color = '';
  }

  document.getElementById('hud-poder-juana').textContent =
    juego.poderesJuana.length === 0 ? 'Sin poder'
      : juego.poderesJuana[juego.poderesJuana.length - 1].nombre;
  document.getElementById('hud-poder-papa').textContent =
    juego.poderesPapa.length === 0 ? 'Sin poder'
      : juego.poderesPapa[juego.poderesPapa.length - 1].nombre;
}

function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  document.getElementById(id).classList.add('activa');
}

function mostrarMensaje(txt) {
  const el = document.getElementById('mensaje-flotante');
  if (!el) return;
  el.textContent = txt;
  el.classList.remove('oculto');
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
  clearTimeout(juego.mensajeTimeoutId);
  juego.mensajeTimeoutId = setTimeout(() => el.classList.add('oculto'), 1300);
}

function togglePausa() {
  if (juego.estado === ESTADO.JUGANDO) {
    juego.estado = ESTADO.PAUSA;
    mostrarMensaje('Pausa');
  } else if (juego.estado === ESTADO.PAUSA) {
    juego.estado = ESTADO.JUGANDO;
  }
}


/* ========== 15. ACCIONES DE BOTONES ========== */

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-accion]');
  if (!el) return;
  const accion = el.dataset.accion;

  if (accion === 'ir-inicio') {
    desconectar();
    reiniciarTodo();
    mostrarPantalla('pantalla-inicio');
  } else if (accion === 'ir-modo') {
    mostrarPantalla('pantalla-modo');
  } else if (accion === 'ir-historia') {
    mostrarPantalla('pantalla-historia');
  } else if (accion === 'ir-juego') {
    iniciarPartida();

  } else if (accion === 'modo-local') {
    RED.modo = 'local';
    mostrarPantalla('pantalla-historia');

  } else if (accion === 'modo-crear') {
    mostrarPantalla('pantalla-crear-sala');
    document.getElementById('zona-codigo').classList.add('oculto');
    document.querySelectorAll('.rol-card').forEach(r => r.classList.remove('elegido'));
  } else if (accion === 'elegir-rol-juana' || accion === 'elegir-rol-papa') {
    const rol = accion === 'elegir-rol-juana' ? 'juana' : 'papa';
    document.querySelectorAll('.rol-card').forEach(r => r.classList.remove('elegido'));
    el.classList.add('elegido');
    iniciarComoHost(rol);
  } else if (accion === 'copiar-codigo') {
    if (RED.codigoSala) {
      navigator.clipboard.writeText(RED.codigoSala)
        .then(() => mostrarMensajeEnEstado('¡Código copiado!', 'exito'))
        .catch(() => mostrarMensajeEnEstado('No pude copiar, cópialo a mano', 'error'));
    }

  } else if (accion === 'modo-unirse') {
    mostrarPantalla('pantalla-unirse-sala');
    document.getElementById('input-codigo').value = '';
    document.getElementById('estado-conexion-cliente').textContent = '';
  } else if (accion === 'conectar-sala') {
    const codigo = document.getElementById('input-codigo').value.trim().toUpperCase();
    if (!codigo) { mostrarMensajeEnEstado('Escribe el código primero', 'error', true); return; }
    iniciarComoCliente(codigo);

  } else if (accion === 'reintentar') {
    if (RED.modo !== 'online_cliente') {
      juego.vidas = 3;
      cargarNivel(juego.nivelIndex);
      juego.estado = ESTADO.JUGANDO;
    }
    mostrarPantalla('pantalla-juego');
  } else if (accion === 'siguiente-nivel') {
    if (RED.modo !== 'online_cliente') {
      juego.nivelIndex++;
      juego.vidas = 3;
      cargarNivel(juego.nivelIndex);
      juego.estado = ESTADO.JUGANDO;
    }
    mostrarPantalla('pantalla-juego');
  }
});

function mostrarMensajeEnEstado(txt, clase, esCliente) {
  const id = esCliente ? 'estado-conexion-cliente' : 'estado-conexion';
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = txt;
  el.classList.remove('exito', 'error');
  if (clase) el.classList.add(clase);
}

function iniciarComoHost(rol) {
  document.getElementById('zona-codigo').classList.remove('oculto');
  document.getElementById('codigo-sala').textContent = '…generando…';
  mostrarMensajeEnEstado('Creando sala…', null);
  crearSala(rol,
    (id) => {
      document.getElementById('codigo-sala').textContent = id;
      mostrarMensajeEnEstado('Esperando que se conecten…', null);
    },
    () => {
      mostrarMensajeEnEstado('¡Conectado! Iniciando…', 'exito');
      setTimeout(() => iniciarPartida(), 800);
    },
    (err) => mostrarMensajeEnEstado('Error: ' + err, 'error')
  );
}

function iniciarComoCliente(codigo) {
  mostrarMensajeEnEstado('Conectando…', null, true);
  unirseASala(codigo,
    (miRol) => {
      mostrarMensajeEnEstado('¡Conectado como ' + miRol.toUpperCase() + '!', 'exito', true);
      setTimeout(() => {
        juego.estado = ESTADO.JUGANDO;
        mostrarPantalla('pantalla-juego');
      }, 800);
    },
    (err) => mostrarMensajeEnEstado('Error: ' + err, 'error', true)
  );
}

function iniciarPartida() {
  // Si soy cliente, no cargo nada (el host envía el estado)
  if (RED.modo === 'online_cliente') {
    juego.estado = ESTADO.JUGANDO;
    mostrarPantalla('pantalla-juego');
    return;
  }
  // Local u online_host: cargar y arrancar
  if (RED.modo !== 'online_host') reiniciarTodo();
  else { juego.nivelIndex = 0; juego.vidas = 3; juego.puntaje = 0;
         juego.poderesJuana = []; juego.poderesPapa = []; }
  cargarNivel(0);
  juego.estado = ESTADO.JUGANDO;
  mostrarPantalla('pantalla-juego');
}

function reiniciarTodo() {
  juego.estado = ESTADO.MENU;
  juego.nivelIndex = 0;
  juego.vidas = 3;
  juego.puntaje = 0;
  juego.poderesJuana = [];
  juego.poderesPapa = [];
  juego.sopaActiva = false;
  juego.sopaTiempoRestante = 0;
}


/* ========== 16. ARRANCAR EL BUCLE ========== */

requestAnimationFrame(loop);
