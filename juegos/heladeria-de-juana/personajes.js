/* ============================================================
   "Personajes Anime" — Sistema modular de sprites estilo manga
   ------------------------------------------------------------
   Inspirado en las viñetas anime de Juana y Papá (fotos ref).
   Estética: líneas marcadas, ojos grandes con brillos, cejas
   expresivas, mejillas rosadas, pelo con mechones detallados.

   Cada función recibe un estado emocional opcional:
     'normal', 'feliz', 'enamorado', 'enojado', 'asustado',
     'sorprendido', 'pensativo', 'asqueado'
   ============================================================ */


/* ========== UTILIDADES DE DIBUJO ANIME ========== */

// Genera ojos manga según estado
function ojosAnime(cx1, cx2, cy, estado, colorIris) {
  const iris = colorIris || '#5b3520';
  const t = {
    normal:      { w: 5, h: 7, pup: 2.5 },
    feliz:       { w: 5, h: 7, pup: 2.5, sonrisa: true },
    enamorado:   { w: 5, h: 7, pup: 0, corazon: true },
    enojado:     { w: 5, h: 4, pup: 2.5, cejaFruncida: true },
    asustado:    { w: 7, h: 9, pup: 1.5, asustado: true },
    sorprendido: { w: 6, h: 8, pup: 1.8 },
    pensativo:   { w: 4, h: 3, pup: 0, semicerrado: true },
    asqueado:    { w: 4, h: 2, pup: 0, semicerrado: true }
  }[estado] || { w: 5, h: 7, pup: 2.5 };

  if (t.sonrisa) {
    // Ojos cerrados de felicidad ^^
    return `
      <path d="M ${cx1-5} ${cy} Q ${cx1} ${cy-4} ${cx1+5} ${cy}" stroke="#1a1428" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M ${cx2-5} ${cy} Q ${cx2} ${cy-4} ${cx2+5} ${cy}" stroke="#1a1428" stroke-width="2" fill="none" stroke-linecap="round"/>
    `;
  }

  if (t.corazon) {
    // Corazones en los ojos
    return [cx1, cx2].map(cx => `
      <text x="${cx}" y="${cy+4}" text-anchor="middle" font-size="14" fill="#ff4f9c">♥</text>
    `).join('');
  }

  if (t.semicerrado) {
    // Líneas finas
    return `
      <path d="M ${cx1-5} ${cy} Q ${cx1} ${cy+1} ${cx1+5} ${cy}" stroke="#1a1428" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M ${cx2-5} ${cy} Q ${cx2} ${cy+1} ${cx2+5} ${cy}" stroke="#1a1428" stroke-width="2" fill="none" stroke-linecap="round"/>
    `;
  }

  // Ojos abiertos manga (con sclera blanca, iris, pupila, brillos)
  const brillos = `
    <circle cx="${cx1+1}" cy="${cy-2}" r="1.5" fill="#fff"/>
    <circle cx="${cx2+1}" cy="${cy-2}" r="1.5" fill="#fff"/>
    <circle cx="${cx1-2}" cy="${cy+2}" r="0.7" fill="#fff" opacity="0.6"/>
    <circle cx="${cx2-2}" cy="${cy+2}" r="0.7" fill="#fff" opacity="0.6"/>
  `;

  return `
    <!-- Sclera -->
    <ellipse cx="${cx1}" cy="${cy}" rx="${t.w}" ry="${t.h}" fill="#fff"/>
    <ellipse cx="${cx2}" cy="${cy}" rx="${t.w}" ry="${t.h}" fill="#fff"/>
    <!-- Iris exterior -->
    <ellipse cx="${cx1}" cy="${cy}" rx="${t.pup+1.5}" ry="${t.pup+2}" fill="${iris}"/>
    <ellipse cx="${cx2}" cy="${cy}" rx="${t.pup+1.5}" ry="${t.pup+2}" fill="${iris}"/>
    <!-- Pupila negra -->
    <ellipse cx="${cx1}" cy="${cy}" rx="${t.pup}" ry="${t.pup+0.5}" fill="#1a0a05"/>
    <ellipse cx="${cx2}" cy="${cy}" rx="${t.pup}" ry="${t.pup+0.5}" fill="#1a0a05"/>
    ${brillos}
    <!-- Línea superior del ojo (marcada estilo manga) -->
    <path d="M ${cx1-t.w} ${cy-t.h*0.6} Q ${cx1} ${cy-t.h-1} ${cx1+t.w} ${cy-t.h*0.6}" stroke="#1a1428" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M ${cx2-t.w} ${cy-t.h*0.6} Q ${cx2} ${cy-t.h-1} ${cx2+t.w} ${cy-t.h*0.6}" stroke="#1a1428" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <!-- Pestañas -->
    <line x1="${cx1-t.w-1}" y1="${cy-t.h*0.6}" x2="${cx1-t.w-3}" y2="${cy-t.h-2}" stroke="#1a1428" stroke-width="1.2"/>
    <line x1="${cx2+t.w+1}" y1="${cy-t.h*0.6}" x2="${cx2+t.w+3}" y2="${cy-t.h-2}" stroke="#1a1428" stroke-width="1.2"/>
  `;
}

// Genera cejas según estado
function cejasAnime(cx1, cx2, cy, estado, colorCabello) {
  const c = colorCabello || '#4a2d1a';
  if (estado === 'enojado') {
    return `
      <path d="M ${cx1-7} ${cy+1} L ${cx1+5} ${cy-3}" stroke="${c}" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M ${cx2+7} ${cy+1} L ${cx2-5} ${cy-3}" stroke="${c}" stroke-width="3" stroke-linecap="round" fill="none"/>
    `;
  }
  if (estado === 'asustado' || estado === 'sorprendido') {
    return `
      <path d="M ${cx1-5} ${cy-2} Q ${cx1} ${cy-5} ${cx1+5} ${cy-2}" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M ${cx2-5} ${cy-2} Q ${cx2} ${cy-5} ${cx2+5} ${cy-2}" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `;
  }
  return `
    <path d="M ${cx1-6} ${cy} Q ${cx1} ${cy-2} ${cx1+6} ${cy}" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M ${cx2-6} ${cy} Q ${cx2} ${cy-2} ${cx2+6} ${cy}" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `;
}

// Genera boca según estado
function bocaAnime(cx, cy, estado) {
  if (estado === 'feliz' || estado === 'enamorado') {
    return `
      <path d="M ${cx-7} ${cy} Q ${cx} ${cy+8} ${cx+7} ${cy}" stroke="#3a1e10" stroke-width="2" fill="#fff" stroke-linecap="round"/>
      <path d="M ${cx-5} ${cy+1} Q ${cx} ${cy+6} ${cx+5} ${cy+1}" stroke="none" fill="#3a1e10"/>
      <!-- Lengua/dientes -->
      <rect x="${cx-3}" y="${cy+1}" width="6" height="2" fill="#fff"/>
    `;
  }
  if (estado === 'sorprendido') {
    return `<ellipse cx="${cx}" cy="${cy+2}" rx="3" ry="4" fill="#3a1e10"/>`;
  }
  if (estado === 'asustado') {
    return `
      <ellipse cx="${cx}" cy="${cy+3}" rx="3.5" ry="5" fill="#1a1428"/>
      <path d="M ${cx-3} ${cy+5} L ${cx+3} ${cy+5}" stroke="#fff" stroke-width="0.8"/>
    `;
  }
  if (estado === 'enojado') {
    return `<path d="M ${cx-5} ${cy+2} L ${cx+5} ${cy+2}" stroke="#3a1e10" stroke-width="2.5" stroke-linecap="round"/>`;
  }
  if (estado === 'asqueado') {
    return `
      <path d="M ${cx-6} ${cy+1} Q ${cx} ${cy-3} ${cx+6} ${cy+1}" stroke="#3a1e10" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M ${cx-3} ${cy-2} L ${cx-3} ${cy+1}" stroke="#3a1e10" stroke-width="1"/>
    `;
  }
  if (estado === 'pensativo') {
    return `<path d="M ${cx-4} ${cy+1} Q ${cx} ${cy+2} ${cx+4} ${cy+1}" stroke="#3a1e10" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  // normal: sonrisa pequeña
  return `<path d="M ${cx-5} ${cy} Q ${cx} ${cy+3} ${cx+5} ${cy}" stroke="#3a1e10" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

// Mejillas rosadas
function mejillasAnime(cy) {
  return `
    <ellipse cx="32" cy="${cy}" rx="5" ry="3" fill="#ff7fb6" opacity="0.6"/>
    <ellipse cx="68" cy="${cy}" rx="5" ry="3" fill="#ff7fb6" opacity="0.6"/>
  `;
}

// Decoraciones por estado emocional
function decoracionesEstado(estado) {
  if (estado === 'enamorado') {
    return `
      <text x="20" y="20" font-size="18" fill="#ff4f9c">♥</text>
      <text x="75" y="22" font-size="14" fill="#ff7fb6">♥</text>
      <text x="85" y="40" font-size="12" fill="#ff4f9c">♥</text>
    `;
  }
  if (estado === 'enojado') {
    return `
      <text x="78" y="22" font-size="20" fill="#ff5252">💢</text>
    `;
  }
  if (estado === 'asustado') {
    return `
      <!-- Gota de sudor -->
      <ellipse cx="82" cy="35" rx="3" ry="5" fill="#6ec1e4" opacity="0.8"/>
      <path d="M 82 30 L 84 32 L 82 34" fill="#6ec1e4"/>
    `;
  }
  if (estado === 'sorprendido') {
    return `<text x="78" y="20" font-size="18" fill="#1a1428" font-weight="bold">!</text>`;
  }
  return '';
}


/* ========== ESTILOS DE CABELLO ANIME ========== */

function cabelloAnime(estilo, color, colorLuz) {
  const luz = colorLuz || color;
  if (estilo === 'juana') {
    // Cabello castaño con flequillo y trenzas a los lados
    return `
      <!-- Casco superior con mechones -->
      <path d="M 25 50 Q 22 25 50 18 Q 78 25 75 50 L 78 60 Q 70 55 65 60 Q 55 45 50 55 Q 45 45 35 60 Q 30 55 22 60 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <!-- Mechón rebelde frontal -->
      <path d="M 40 35 Q 50 25 60 35 L 58 42 Q 50 36 42 42 Z" fill="${luz}"/>
      <!-- Trenza izquierda -->
      <path d="M 22 55 Q 18 70 16 85 Q 14 92 18 95 Q 22 92 22 85 Q 24 75 26 60 Z" fill="${color}" stroke="#1a1428" stroke-width="1.2"/>
      <circle cx="20" cy="60" r="3" fill="${color}"/>
      <!-- Trenza derecha -->
      <path d="M 78 55 Q 82 70 84 85 Q 86 92 82 95 Q 78 92 78 85 Q 76 75 74 60 Z" fill="${color}" stroke="#1a1428" stroke-width="1.2"/>
      <circle cx="80" cy="60" r="3" fill="${color}"/>
      <!-- Lacitos rojos -->
      <circle cx="18" cy="93" r="3" fill="#e83e3e" stroke="#1a1428" stroke-width="1"/>
      <circle cx="82" cy="93" r="3" fill="#e83e3e" stroke="#1a1428" stroke-width="1"/>
      <!-- Brillos en el cabello -->
      <path d="M 35 30 Q 40 28 45 32" stroke="${luz}" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M 55 30 Q 60 28 65 32" stroke="${luz}" stroke-width="2" fill="none" opacity="0.6"/>
    `;
  }
  if (estilo === 'papa') {
    // Pelo negro corto puntiagudo estilo manga
    return `
      <!-- Casco base -->
      <path d="M 25 40 Q 22 25 50 18 Q 78 25 75 40 L 75 48 L 25 48 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <!-- Mechones puntiagudos -->
      <path d="M 28 30 L 32 15 L 38 28 L 45 12 L 52 25 L 58 14 L 64 28 L 70 18 L 72 30 Z" fill="${color}" stroke="#1a1428" stroke-width="1.2"/>
      <!-- Mechón frontal rebelde -->
      <path d="M 38 32 Q 48 22 56 30 L 54 38 Q 48 32 40 38 Z" fill="${luz}" opacity="0.7"/>
      <!-- Pequeños brillos -->
      <line x1="40" y1="22" x2="45" y2="20" stroke="${luz}" stroke-width="1.5" opacity="0.8"/>
      <line x1="60" y1="22" x2="65" y2="20" stroke="${luz}" stroke-width="1.5" opacity="0.8"/>
    `;
  }
  if (estilo === 'mama-largo') {
    // Cabello largo ondulado castaño
    return `
      <!-- Cabeza coverage -->
      <path d="M 22 35 Q 22 15 50 12 Q 78 15 78 35 Q 80 80 75 100 L 70 110 Q 60 90 50 95 Q 40 90 30 110 L 25 100 Q 20 80 22 35 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <!-- Flequillo lateral -->
      <path d="M 30 28 Q 50 22 70 30 L 65 38 Q 55 30 35 38 Z" fill="${luz}"/>
      <!-- Brillos -->
      <path d="M 30 50 Q 32 70 30 90" stroke="${luz}" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M 70 50 Q 68 70 70 90" stroke="${luz}" stroke-width="2" fill="none" opacity="0.7"/>
    `;
  }
  if (estilo === 'corto-modern') {
    // Pelo corto moderno (Adri)
    return `
      <path d="M 23 38 Q 23 18 50 15 Q 77 18 77 38 L 75 48 Q 65 38 55 45 Q 50 38 45 45 Q 35 38 25 48 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <path d="M 38 28 Q 48 22 56 28 L 55 35 Q 48 30 40 35 Z" fill="${luz}"/>
    `;
  }
  if (estilo === 'rizado') {
    // Pelo rizado (Cata)
    return `
      <path d="M 22 38 Q 22 15 50 12 Q 78 15 78 38 L 80 48 Q 75 42 72 48 Q 65 38 60 48 Q 55 38 50 48 Q 45 38 40 48 Q 35 38 28 48 Q 25 42 20 48 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <!-- Rizos extra -->
      <circle cx="25" cy="20" r="5" fill="${color}" stroke="#1a1428" stroke-width="1"/>
      <circle cx="75" cy="20" r="5" fill="${color}" stroke="#1a1428" stroke-width="1"/>
      <circle cx="35" cy="14" r="4" fill="${color}"/>
      <circle cx="65" cy="14" r="4" fill="${color}"/>
    `;
  }
  if (estilo === 'mono-abuela') {
    // Cabello blanco con moño
    return `
      <path d="M 28 45 Q 28 22 50 18 Q 72 22 72 45 L 72 50 L 28 50 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <!-- Moño arriba -->
      <circle cx="50" cy="12" r="11" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <!-- Detalles del moño -->
      <path d="M 45 8 Q 50 4 55 8" stroke="${luz}" stroke-width="1.5" fill="none"/>
      <!-- Mechones a los lados -->
      <path d="M 28 40 Q 22 50 25 60" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 72 40 Q 78 50 75 60" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
    `;
  }
  if (estilo === 'tio-barba') {
    // Pelo corto con frente despejada
    return `
      <path d="M 28 38 Q 28 20 50 16 Q 72 20 72 38 L 72 45 L 28 45 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <!-- Mechones puntiagudos suaves -->
      <path d="M 35 25 L 40 18 L 45 26 L 50 18 L 55 26 L 60 18 L 65 25" stroke="${color}" stroke-width="2" fill="${color}"/>
    `;
  }
  return '';
}


/* ========== ACCESORIOS ========== */

function accesorios(tipo, colorPelo) {
  if (tipo === 'gafas-redondas') {
    return `
      <circle cx="36" cy="55" r="7" fill="#fff" stroke="#1a1428" stroke-width="2" opacity="0.4"/>
      <circle cx="64" cy="55" r="7" fill="#fff" stroke="#1a1428" stroke-width="2" opacity="0.4"/>
      <line x1="43" y1="55" x2="57" y2="55" stroke="#1a1428" stroke-width="2"/>
    `;
  }
  if (tipo === 'gafas-astronauta') {
    return `
      <rect x="28" y="48" width="44" height="16" rx="4" fill="#3d7ab8" stroke="#1a1428" stroke-width="2" opacity="0.5"/>
      <line x1="50" y1="48" x2="50" y2="64" stroke="#1a1428" stroke-width="1.5"/>
    `;
  }
  if (tipo === 'barba-cerrada') {
    return `
      <!-- Bigote -->
      <path d="M 42 68 Q 50 70 58 68" stroke="${colorPelo || '#33302e'}" stroke-width="3" fill="none" opacity="0.9"/>
      <!-- Barba mentón -->
      <path d="M 38 72 Q 50 80 62 72 Q 60 78 50 80 Q 40 78 38 72" fill="${colorPelo || '#33302e'}" opacity="0.85"/>
      <!-- Patillas -->
      <path d="M 28 60 Q 26 70 30 75" stroke="${colorPelo || '#33302e'}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M 72 60 Q 74 70 70 75" stroke="${colorPelo || '#33302e'}" stroke-width="3" fill="none" opacity="0.7"/>
    `;
  }
  return '';
}


/* ========== SPRITE COMPLETO ========== */

/* Genera el SVG completo de un personaje
   opts: {
     colorPiel, colorPelo, peloLuz, estiloCabello,
     ropa, accesorio, estado, emoji
   }
*/
function spriteAnime(opts) {
  const piel = opts.colorPiel || '#fbd0a3';
  const pieloscuro = ajustarTono(piel, -20);
  const ropa = opts.ropa || '#3d7ab8';
  const ropaOscura = ajustarTono(ropa, -25);

  return `
<svg viewBox="0 0 100 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ropa-${opts._id || 'x'}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${ropa}"/>
      <stop offset="100%" stop-color="${ropaOscura}"/>
    </linearGradient>
  </defs>

  <!-- Cuello -->
  <rect x="44" y="95" width="12" height="14" fill="${piel}" stroke="#1a1428" stroke-width="1.5"/>

  <!-- Cuerpo (camiseta) -->
  <path d="M 25 110 Q 25 105 32 105 L 44 109 Q 50 112 56 109 L 68 105 Q 75 105 75 110 L 80 180 L 20 180 Z"
        fill="url(#ropa-${opts._id || 'x'})" stroke="#1a1428" stroke-width="1.8"/>

  <!-- Línea del cuello en V (si aplica) -->
  ${opts.cuelloV ? `<path d="M 42 109 L 50 118 L 58 109" stroke="#1a1428" stroke-width="1.5" fill="none"/>` : ''}

  <!-- Brazos -->
  <ellipse cx="22" cy="130" rx="6" ry="14" fill="${piel}" stroke="#1a1428" stroke-width="1.5"/>
  <ellipse cx="78" cy="130" rx="6" ry="14" fill="${piel}" stroke="#1a1428" stroke-width="1.5"/>

  <!-- Cabeza (forma redonda con barbilla) -->
  <path d="M 28 50 Q 28 25 50 22 Q 72 25 72 50 L 72 70 Q 72 88 50 92 Q 28 88 28 70 Z"
        fill="${piel}" stroke="#1a1428" stroke-width="1.8"/>

  <!-- Cabello (por estilo) -->
  ${cabelloAnime(opts.estiloCabello, opts.colorPelo, opts.peloLuz)}

  <!-- Cejas -->
  ${cejasAnime(36, 64, 42, opts.estado, opts.colorPelo)}

  <!-- Ojos -->
  ${ojosAnime(36, 64, 55, opts.estado, opts.colorIris)}

  <!-- Mejillas rosadas -->
  ${mejillasAnime(72)}

  <!-- Boca -->
  ${bocaAnime(50, 78, opts.estado)}

  <!-- Accesorios -->
  ${accesorios(opts.accesorio, opts.colorPelo)}

  <!-- Decoraciones de estado emocional -->
  ${decoracionesEstado(opts.estado)}

  <!-- Emoji distintivo (para clientes random) -->
  ${opts.emoji ? `<text x="50" y="195" text-anchor="middle" font-size="18">${opts.emoji}</text>` : ''}

  <!-- Sombra debajo -->
  <ellipse cx="50" cy="190" rx="30" ry="3" fill="#000" opacity="0.15"/>
</svg>`;
}


/* ========== AJUSTE DE TONO ========== */
function ajustarTono(hex, delta) {
  // Helper para oscurecer/aclarar un color hex
  const c = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(c.substr(0,2), 16) + delta));
  const g = Math.max(0, Math.min(255, parseInt(c.substr(2,2), 16) + delta));
  const b = Math.max(0, Math.min(255, parseInt(c.substr(4,2), 16) + delta));
  return '#' + [r,g,b].map(x => x.toString(16).padStart(2, '0')).join('');
}


/* ========== PERFILES DE CADA PERSONAJE ========== */

const PERFIL_PERSONAJES = {
  juana: {
    _id: 'juana',
    colorPiel: '#fbd0a3',
    colorPelo: '#4a2d1a',
    peloLuz: '#a87440',
    estiloCabello: 'juana',
    ropa: '#a8d5f0',           // camiseta azul claro como en la viñeta
    colorIris: '#5b3520'
  },
  papa: {
    _id: 'papa',
    colorPiel: '#f2c39c',
    colorPelo: '#1a1a22',
    peloLuz: '#3a3a45',
    estiloCabello: 'papa',
    ropa: '#f4e8c8',           // camiseta crema cuello V
    cuelloV: true,
    accesorio: 'barba-cerrada',
    colorIris: '#3a2010'
  },
  mama: {
    _id: 'mama',
    colorPiel: '#fbd0a3',
    colorPelo: '#5b3a2e',
    peloLuz: '#8b5a3c',
    estiloCabello: 'mama-largo',
    ropa: '#ff7fb6',
    colorIris: '#5b3520'
  },
  tioDany: {
    _id: 'tio-dany',
    colorPiel: '#f2c39c',
    colorPelo: '#2a2a35',
    peloLuz: '#4a4a55',
    estiloCabello: 'tio-barba',
    ropa: '#3d7ab8',
    accesorio: 'barba-cerrada',
    colorIris: '#3a2010'
  },
  abuelita: {
    _id: 'abuelita',
    colorPiel: '#fbe2c4',
    colorPelo: '#f0f0f0',
    peloLuz: '#fff',
    estiloCabello: 'mono-abuela',
    ropa: '#c084fc',
    accesorio: 'gafas-redondas',
    colorIris: '#5b3520'
  },
  tiaAdri: {
    _id: 'tia-adri',
    colorPiel: '#fbd0a3',
    colorPelo: '#4a2d1a',
    peloLuz: '#7a4a2c',
    estiloCabello: 'corto-modern',
    ropa: '#7fd8c8',
    colorIris: '#5b3520'
  },
  tiaCata: {
    _id: 'tia-cata',
    colorPiel: '#fbd0a3',
    colorPelo: '#5b3a2e',
    peloLuz: '#8b5a3c',
    estiloCabello: 'rizado',
    ropa: '#95e1c1',
    colorIris: '#5b3520'
  },
  // Clientes random
  dinosaurio: {
    _id: 'dino',
    colorPiel: '#6fc94c',
    colorPelo: '#4a9c30',
    peloLuz: '#95e1c1',
    estiloCabello: 'papa',
    ropa: '#ff7a3d',
    emoji: '🦖',
    colorIris: '#1a4010'
  },
  robot: {
    _id: 'robot',
    colorPiel: '#bcc7e0',
    colorPelo: '#666',
    peloLuz: '#888',
    estiloCabello: 'tio-barba',
    ropa: '#3d7ab8',
    accesorio: 'gafas-astronauta',
    emoji: '🤖',
    colorIris: '#1a1428'
  },
  fantasma: {
    _id: 'fantasma',
    colorPiel: '#e0e8ff',
    colorPelo: '#fff',
    peloLuz: '#fff',
    estiloCabello: 'papa',
    ropa: '#e0e8ff',
    emoji: '👻',
    colorIris: '#3a3a55'
  },
  princesa: {
    _id: 'princesa',
    colorPiel: '#fbd0a3',
    colorPelo: '#ffd866',
    peloLuz: '#ffe98a',
    estiloCabello: 'mama-largo',
    ropa: '#ffb0d4',
    emoji: '🦄',
    colorIris: '#5b3520'
  },
  astronauta: {
    _id: 'astronauta',
    colorPiel: '#f4c69a',
    colorPelo: '#1a1a22',
    peloLuz: '#3a3a45',
    estiloCabello: 'papa',
    ropa: '#fff',
    accesorio: 'gafas-astronauta',
    emoji: '👨‍🚀',
    colorIris: '#3a2010'
  },
  pirata: {
    _id: 'pirata',
    colorPiel: '#f2c39c',
    colorPelo: '#1a1a22',
    peloLuz: '#3a3a45',
    estiloCabello: 'mama-largo',
    ropa: '#3d7ab8',
    accesorio: 'barba-cerrada',
    emoji: '🏴‍☠️',
    colorIris: '#3a2010'
  }
};

/* Función pública: dibujar un personaje por ID con estado emocional */
function svgPersonaje(personajeId, estado) {
  const perfil = PERFIL_PERSONAJES[personajeId];
  if (!perfil) return '';
  return spriteAnime({ ...perfil, estado: estado || 'normal' });
}

/* Resolver el ID de cliente a perfil */
const ID_A_PERFIL = {
  'mama': 'mama',
  'tio-dany': 'tioDany',
  'abuelita': 'abuelita',
  'tia-adri': 'tiaAdri',
  'tia-cata': 'tiaCata',
  'papa': 'papa',
  'dinosaurio': 'dinosaurio',
  'robot': 'robot',
  'fantasma': 'fantasma',
  'unicornio': 'princesa',
  'astronauta': 'astronauta',
  'pirata': 'pirata'
};
