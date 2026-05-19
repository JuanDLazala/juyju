/* ============================================================
   "Personajes" — Sistema modular de sprites
   ------------------------------------------------------------
   - Juana y Papá: usan IMÁGENES REALES (manga-cuerpo-entero.jpeg)
     recortadas con object-position para mostrar solo cada uno.
   - Familia: SVGs estilizados anime basados en las fotos reales
     (Mamá Laura, Tía Adri, Tía Cata, Abuelita Sarita, Tío Dany).
   - Clientes random: SVGs creativos con emoji distintivo.
   ============================================================ */


/* ========== JUANA Y PAPÁ: foto manga recortada ========== */

function imgJuana(estado) {
  return `
    <div class="char-photo char-juana ${estado || ''}">
      <img src="../../personajes/manga-cuerpo-entero.jpeg"
           alt="Juana" class="char-photo-img char-img-juana"
           onerror="this.style.display='none'" />
      ${overlayEstado(estado)}
    </div>
  `;
}

function imgPapa(estado) {
  return `
    <div class="char-photo char-papa ${estado || ''}">
      <img src="../../personajes/manga-cuerpo-entero.jpeg"
           alt="Papá" class="char-photo-img char-img-papa"
           onerror="this.style.display='none'" />
      ${overlayEstado(estado)}
    </div>
  `;
}

function overlayEstado(estado) {
  if (estado === 'enamorado') {
    return `<div class="char-overlay char-amor"><span>💖</span><span>💕</span><span>💖</span></div>`;
  }
  if (estado === 'asqueado') {
    return `<div class="char-overlay char-asco"><span>💢</span><span>🤢</span><span>💢</span></div>`;
  }
  if (estado === 'asustado') {
    return `<div class="char-overlay char-susto"><span>💦</span><span>😱</span></div>`;
  }
  if (estado === 'feliz') {
    return `<div class="char-overlay char-feliz"><span>✨</span><span>⭐</span></div>`;
  }
  if (estado === 'sorprendido') {
    return `<div class="char-overlay char-sorpresa"><span>❗</span></div>`;
  }
  return '';
}


/* ========== UTILIDADES DE DIBUJO ANIME (familia + random) ========== */

function ojosAnime(cx1, cx2, cy, estado, colorIris) {
  const iris = colorIris || '#5b3520';
  const t = {
    normal:      { w: 5, h: 7, pup: 2.5 },
    feliz:       { w: 5, h: 7, sonrisa: true },
    enamorado:   { w: 5, h: 7, corazon: true },
    enojado:     { w: 5, h: 4, pup: 2.5 },
    asustado:    { w: 7, h: 9, pup: 1.5 },
    sorprendido: { w: 6, h: 8, pup: 1.8 },
    pensativo:   { w: 4, h: 3, semicerrado: true },
    asqueado:    { w: 4, h: 2, semicerrado: true }
  }[estado] || { w: 5, h: 7, pup: 2.5 };

  if (t.sonrisa) {
    return `
      <path d="M ${cx1-5} ${cy} Q ${cx1} ${cy-4} ${cx1+5} ${cy}" stroke="#1a1428" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M ${cx2-5} ${cy} Q ${cx2} ${cy-4} ${cx2+5} ${cy}" stroke="#1a1428" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  if (t.corazon) {
    return [cx1, cx2].map(cx => `<text x="${cx}" y="${cy+4}" text-anchor="middle" font-size="14" fill="#ff4f9c">♥</text>`).join('');
  }
  if (t.semicerrado) {
    return `
      <path d="M ${cx1-5} ${cy} Q ${cx1} ${cy+1} ${cx1+5} ${cy}" stroke="#1a1428" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M ${cx2-5} ${cy} Q ${cx2} ${cy+1} ${cx2+5} ${cy}" stroke="#1a1428" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  return `
    <ellipse cx="${cx1}" cy="${cy}" rx="${t.w}" ry="${t.h}" fill="#fff"/>
    <ellipse cx="${cx2}" cy="${cy}" rx="${t.w}" ry="${t.h}" fill="#fff"/>
    <ellipse cx="${cx1}" cy="${cy}" rx="${t.pup+1.5}" ry="${t.pup+2}" fill="${iris}"/>
    <ellipse cx="${cx2}" cy="${cy}" rx="${t.pup+1.5}" ry="${t.pup+2}" fill="${iris}"/>
    <ellipse cx="${cx1}" cy="${cy}" rx="${t.pup}" ry="${t.pup+0.5}" fill="#1a0a05"/>
    <ellipse cx="${cx2}" cy="${cy}" rx="${t.pup}" ry="${t.pup+0.5}" fill="#1a0a05"/>
    <circle cx="${cx1+1}" cy="${cy-2}" r="1.5" fill="#fff"/>
    <circle cx="${cx2+1}" cy="${cy-2}" r="1.5" fill="#fff"/>
    <path d="M ${cx1-t.w} ${cy-t.h*0.6} Q ${cx1} ${cy-t.h-1} ${cx1+t.w} ${cy-t.h*0.6}" stroke="#1a1428" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M ${cx2-t.w} ${cy-t.h*0.6} Q ${cx2} ${cy-t.h-1} ${cx2+t.w} ${cy-t.h*0.6}" stroke="#1a1428" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}

function cejasAnime(cx1, cx2, cy, estado, colorCabello) {
  const c = colorCabello || '#4a2d1a';
  if (estado === 'enojado') {
    return `
      <path d="M ${cx1-7} ${cy+1} L ${cx1+5} ${cy-3}" stroke="${c}" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M ${cx2+7} ${cy+1} L ${cx2-5} ${cy-3}" stroke="${c}" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  }
  if (estado === 'asustado' || estado === 'sorprendido') {
    return `
      <path d="M ${cx1-5} ${cy-2} Q ${cx1} ${cy-5} ${cx1+5} ${cy-2}" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M ${cx2-5} ${cy-2} Q ${cx2} ${cy-5} ${cx2+5} ${cy-2}" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  }
  return `
    <path d="M ${cx1-6} ${cy} Q ${cx1} ${cy-2} ${cx1+6} ${cy}" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M ${cx2-6} ${cy} Q ${cx2} ${cy-2} ${cx2+6} ${cy}" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
}

function bocaAnime(cx, cy, estado) {
  if (estado === 'feliz' || estado === 'enamorado') {
    return `
      <path d="M ${cx-7} ${cy} Q ${cx} ${cy+8} ${cx+7} ${cy}" stroke="#3a1e10" stroke-width="2" fill="#fff" stroke-linecap="round"/>
      <path d="M ${cx-5} ${cy+1} Q ${cx} ${cy+6} ${cx+5} ${cy+1}" stroke="none" fill="#3a1e10"/>
      <rect x="${cx-3}" y="${cy+1}" width="6" height="2" fill="#fff"/>`;
  }
  if (estado === 'sorprendido') return `<ellipse cx="${cx}" cy="${cy+2}" rx="3" ry="4" fill="#3a1e10"/>`;
  if (estado === 'asustado')   return `<ellipse cx="${cx}" cy="${cy+3}" rx="3.5" ry="5" fill="#1a1428"/>`;
  if (estado === 'enojado')    return `<path d="M ${cx-5} ${cy+2} L ${cx+5} ${cy+2}" stroke="#3a1e10" stroke-width="2.5" stroke-linecap="round"/>`;
  if (estado === 'asqueado') {
    return `<path d="M ${cx-6} ${cy+1} Q ${cx} ${cy-3} ${cx+6} ${cy+1}" stroke="#3a1e10" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  if (estado === 'pensativo') return `<path d="M ${cx-4} ${cy+1} Q ${cx} ${cy+2} ${cx+4} ${cy+1}" stroke="#3a1e10" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  return `<path d="M ${cx-5} ${cy} Q ${cx} ${cy+3} ${cx+5} ${cy}" stroke="#3a1e10" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

function mejillasAnime(cy) {
  return `
    <ellipse cx="32" cy="${cy}" rx="5" ry="3" fill="#ff7fb6" opacity="0.6"/>
    <ellipse cx="68" cy="${cy}" rx="5" ry="3" fill="#ff7fb6" opacity="0.6"/>`;
}

function decoracionesEstado(estado) {
  if (estado === 'enamorado') return `<text x="20" y="20" font-size="18" fill="#ff4f9c">♥</text><text x="78" y="22" font-size="14" fill="#ff7fb6">♥</text>`;
  if (estado === 'enojado')   return `<text x="78" y="22" font-size="20" fill="#ff5252">💢</text>`;
  if (estado === 'asustado')  return `<ellipse cx="82" cy="35" rx="3" ry="5" fill="#6ec1e4" opacity="0.8"/>`;
  if (estado === 'sorprendido') return `<text x="78" y="20" font-size="18" fill="#1a1428" font-weight="bold">!</text>`;
  return '';
}


/* ========== ESTILOS DE CABELLO (basados en fotos reales) ========== */

function cabelloAnime(estilo, color, colorLuz) {
  const luz = colorLuz || color;

  if (estilo === 'mama-rizado') {
    return `
      <path d="M 22 35 Q 18 12 50 12 Q 82 12 78 35 Q 82 60 78 85 L 72 95 Q 65 80 58 90 Q 50 80 42 90 Q 35 80 28 95 L 22 85 Q 18 60 22 35 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <circle cx="28" cy="25" r="6" fill="${color}" stroke="#1a1428" stroke-width="1"/>
      <circle cx="50" cy="14" r="7" fill="${color}" stroke="#1a1428" stroke-width="1"/>
      <circle cx="72" cy="25" r="6" fill="${color}" stroke="#1a1428" stroke-width="1"/>`;
  }
  if (estilo === 'tia-adri') {
    return `
      <path d="M 22 35 Q 20 10 50 10 Q 80 10 78 35 Q 82 70 78 100 L 70 115 Q 60 95 50 105 Q 40 95 30 115 L 22 100 Q 18 70 22 35 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <path d="M 30 30 Q 50 24 70 30 L 65 38 Q 55 32 35 38 Z" fill="${luz}"/>
      <ellipse cx="38" cy="52" rx="9" ry="6" fill="rgba(255,255,255,0.95)" stroke="#1a1428" stroke-width="2"/>
      <ellipse cx="62" cy="52" rx="9" ry="6" fill="rgba(255,255,255,0.95)" stroke="#1a1428" stroke-width="2"/>
      <line x1="47" y1="52" x2="53" y2="52" stroke="#1a1428" stroke-width="2"/>`;
  }
  if (estilo === 'tia-cata') {
    return `
      <path d="M 25 35 Q 25 14 50 12 Q 75 14 75 35 L 75 48 L 25 48 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <circle cx="50" cy="8" r="7" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <path d="M 30 28 Q 50 22 70 28 L 65 34 Q 55 28 35 34 Z" fill="${luz}"/>
      <path d="M 22 38 Q 18 48 22 58" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 78 38 Q 82 48 78 58" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  if (estilo === 'abuelita') {
    return `
      <path d="M 24 38 Q 24 16 50 14 Q 76 16 76 38 L 76 50 L 24 50 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <path d="M 32 22 L 36 30" stroke="${luz}" stroke-width="1.5" opacity="0.8"/>
      <path d="M 50 18 L 50 28" stroke="${luz}" stroke-width="1.5" opacity="0.8"/>
      <path d="M 68 22 L 64 30" stroke="${luz}" stroke-width="1.5" opacity="0.8"/>`;
  }
  if (estilo === 'tio-dany') {
    return `
      <path d="M 26 38 Q 26 18 50 16 Q 74 18 74 38 L 74 45 L 26 45 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <path d="M 30 28 L 35 18 L 42 26 L 48 16 L 55 26 L 62 18 L 68 28 Z" fill="${color}"/>
      <rect x="28" y="46" width="20" height="13" rx="3" fill="rgba(20,20,30,0.7)" stroke="#1a1428" stroke-width="2"/>
      <rect x="52" y="46" width="20" height="13" rx="3" fill="rgba(20,20,30,0.7)" stroke="#1a1428" stroke-width="2"/>
      <line x1="48" y1="52" x2="52" y2="52" stroke="#1a1428" stroke-width="2"/>`;
  }
  if (estilo === 'spiky') {
    return `
      <path d="M 25 40 Q 22 25 50 18 Q 78 25 75 40 L 75 48 L 25 48 Z" fill="${color}" stroke="#1a1428" stroke-width="1.5"/>
      <path d="M 28 30 L 32 15 L 38 28 L 45 12 L 52 25 L 58 14 L 64 28 L 70 18 L 72 30 Z" fill="${color}" stroke="#1a1428" stroke-width="1.2"/>`;
  }
  return '';
}

function accesorios(tipo, colorPelo) {
  if (tipo === 'barba-cerrada') {
    return `
      <path d="M 42 68 Q 50 70 58 68" stroke="${colorPelo || '#33302e'}" stroke-width="3" fill="none" opacity="0.9"/>
      <path d="M 38 72 Q 50 80 62 72 Q 60 78 50 80 Q 40 78 38 72" fill="${colorPelo || '#33302e'}" opacity="0.85"/>
      <path d="M 28 60 Q 26 70 30 75" stroke="${colorPelo || '#33302e'}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M 72 60 Q 74 70 70 75" stroke="${colorPelo || '#33302e'}" stroke-width="3" fill="none" opacity="0.7"/>`;
  }
  return '';
}


/* ========== SPRITE COMPLETO ========== */

function spriteAnime(opts) {
  const piel = opts.colorPiel || '#fbd0a3';
  const ropa = opts.ropa || '#3d7ab8';
  return `
<svg viewBox="0 0 100 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <rect x="44" y="95" width="12" height="14" fill="${piel}" stroke="#1a1428" stroke-width="1.5"/>
  <path d="M 25 110 Q 25 105 32 105 L 44 109 Q 50 112 56 109 L 68 105 Q 75 105 75 110 L 80 180 L 20 180 Z" fill="${ropa}" stroke="#1a1428" stroke-width="1.8"/>
  <ellipse cx="22" cy="130" rx="6" ry="14" fill="${piel}" stroke="#1a1428" stroke-width="1.5"/>
  <ellipse cx="78" cy="130" rx="6" ry="14" fill="${piel}" stroke="#1a1428" stroke-width="1.5"/>
  <path d="M 28 50 Q 28 25 50 22 Q 72 25 72 50 L 72 70 Q 72 88 50 92 Q 28 88 28 70 Z" fill="${piel}" stroke="#1a1428" stroke-width="1.8"/>
  ${cabelloAnime(opts.estiloCabello, opts.colorPelo, opts.peloLuz)}
  ${cejasAnime(36, 64, 42, opts.estado, opts.colorPelo)}
  ${ojosAnime(36, 64, 55, opts.estado, opts.colorIris)}
  ${mejillasAnime(72)}
  ${bocaAnime(50, 78, opts.estado)}
  ${accesorios(opts.accesorio, opts.colorPelo)}
  ${decoracionesEstado(opts.estado)}
  ${opts.emoji ? `<text x="50" y="195" text-anchor="middle" font-size="18">${opts.emoji}</text>` : ''}
  <ellipse cx="50" cy="190" rx="30" ry="3" fill="#000" opacity="0.15"/>
</svg>`;
}


/* ========== PERFILES (basados en las fotos reales) ========== */

const PERFIL_PERSONAJES = {
  mama: {
    colorPiel: '#fbd0a3', colorPelo: '#6b3e2c', peloLuz: '#a87440',
    estiloCabello: 'mama-rizado',
    ropa: '#1e5cc8', colorIris: '#5a6f3a'
  },
  tioDany: {
    colorPiel: '#e8b884', colorPelo: '#2a2a35', peloLuz: '#4a4a55',
    estiloCabello: 'tio-dany',
    ropa: '#1a1a25', accesorio: 'barba-cerrada', colorIris: '#3a2010'
  },
  abuelita: {
    colorPiel: '#fbe2c4', colorPelo: '#8b5a3c', peloLuz: '#d4c4b0',
    estiloCabello: 'abuelita',
    ropa: '#7a8a6b', colorIris: '#5b3520'
  },
  tiaAdri: {
    colorPiel: '#f4c69a', colorPelo: '#3a2418', peloLuz: '#6b4a30',
    estiloCabello: 'tia-adri',
    ropa: '#fff', colorIris: '#3a2010'
  },
  tiaCata: {
    colorPiel: '#fbe2c4', colorPelo: '#8b6a3c', peloLuz: '#c79560',
    estiloCabello: 'tia-cata',
    ropa: '#ffd866', colorIris: '#5b3520'
  },
  dinosaurio: { colorPiel: '#6fc94c', colorPelo: '#4a9c30', peloLuz: '#95e1c1', estiloCabello: 'spiky', ropa: '#ff7a3d', emoji: '🦖', colorIris: '#1a4010' },
  robot:      { colorPiel: '#bcc7e0', colorPelo: '#666',    peloLuz: '#888',    estiloCabello: 'spiky', ropa: '#3d7ab8', emoji: '🤖', colorIris: '#1a1428' },
  fantasma:   { colorPiel: '#e0e8ff', colorPelo: '#fff',    peloLuz: '#fff',    estiloCabello: 'spiky', ropa: '#e0e8ff', emoji: '👻', colorIris: '#3a3a55' },
  princesa:   { colorPiel: '#fbd0a3', colorPelo: '#ffd866', peloLuz: '#ffe98a', estiloCabello: 'mama-rizado', ropa: '#ffb0d4', emoji: '🦄', colorIris: '#5b3520' },
  astronauta: { colorPiel: '#f4c69a', colorPelo: '#1a1a22', peloLuz: '#3a3a45', estiloCabello: 'spiky', ropa: '#fff', emoji: '👨‍🚀', colorIris: '#3a2010' },
  pirata:     { colorPiel: '#f2c39c', colorPelo: '#1a1a22', peloLuz: '#3a3a45', estiloCabello: 'mama-rizado', ropa: '#3d7ab8', accesorio: 'barba-cerrada', emoji: '🏴‍☠️', colorIris: '#3a2010' }
};


/* Función pública */
function svgPersonaje(personajeId, estado) {
  // Juana y Papá → foto real recortada
  if (personajeId === 'juana') return imgJuana(estado);
  if (personajeId === 'papa')  return imgPapa(estado);

  const perfil = PERFIL_PERSONAJES[personajeId];
  if (!perfil) return imgPapa(estado);
  return spriteAnime({ ...perfil, estado: estado || 'normal' });
}

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
