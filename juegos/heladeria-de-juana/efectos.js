/* ============================================================
   "Efectos" — Partículas + sonidos sintéticos (Web Audio API)
   Sin assets externos, todo generado en runtime.
   ============================================================ */


/* ========== SONIDOS SINTÉTICOS ========== */

let audioCtx = null;

function asegurarAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {
      console.warn('Sin audio:', e);
    }
  }
  return audioCtx;
}

function tono(frecuencia, duracion, tipo, volumen) {
  const ctx = asegurarAudio(); if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = tipo || 'sine';
  osc.frequency.value = frecuencia;
  gain.gain.setValueAtTime(volumen || 0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracion);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duracion);
}

function sonidoPlop() {
  // Suave "plop" al agregar ingrediente
  tono(280, 0.08, 'sine', 0.12);
  setTimeout(() => tono(180, 0.06, 'sine', 0.08), 30);
}

function sonidoDing() {
  // Ding cristalino al servir
  tono(880, 0.15, 'sine', 0.15);
  setTimeout(() => tono(1320, 0.2, 'sine', 0.1), 60);
}

function sonidoFanfare() {
  // Fanfarria al subir nivel
  const notas = [523, 659, 784, 1047];
  notas.forEach((n, i) => setTimeout(() => tono(n, 0.18, 'triangle', 0.18), i * 90));
}

function sonidoMoneda() {
  // Cha-ching
  tono(988, 0.06, 'sine', 0.15);
  setTimeout(() => tono(1319, 0.1, 'sine', 0.12), 50);
}

function sonidoRisa() {
  // "Risa" papá feliz (notas rápidas ascendentes)
  [400, 500, 600, 500].forEach((n, i) => setTimeout(() => tono(n, 0.08, 'sawtooth', 0.1), i * 80));
}

function sonidoSusto() {
  // Sonido de susto cuando papá huye
  tono(800, 0.1, 'sawtooth', 0.18);
  setTimeout(() => tono(400, 0.15, 'sawtooth', 0.15), 50);
  setTimeout(() => tono(200, 0.2, 'sawtooth', 0.12), 120);
}

function sonidoLimpiar() {
  // Sonido suave al limpiar el cono
  tono(150, 0.2, 'triangle', 0.1);
}


/* ========== PARTÍCULAS ========== */

function crearParticulas(opts) {
  // opts: { x, y, emoji o color, cantidad, duracion, esparcimiento }
  const cont = document.createElement('div');
  cont.style.cssText = `
    position: fixed; left: ${opts.x}px; top: ${opts.y}px;
    pointer-events: none; z-index: 9999;
  `;
  document.body.appendChild(cont);

  for (let i = 0; i < (opts.cantidad || 12); i++) {
    const p = document.createElement('div');
    const angulo = Math.random() * Math.PI * 2;
    const fuerza = (opts.esparcimiento || 100) * (0.5 + Math.random() * 0.5);
    const dx = Math.cos(angulo) * fuerza;
    const dy = Math.sin(angulo) * fuerza - 50;  // tendencia hacia arriba

    p.style.cssText = `
      position: absolute; left: 0; top: 0;
      font-size: ${opts.tamano || '24px'};
      color: ${opts.color || '#ffd866'};
      transition: transform ${opts.duracion || 1}s cubic-bezier(.2,.8,.2,1), opacity ${opts.duracion || 1}s;
      will-change: transform, opacity;
    `;
    p.textContent = opts.emoji || '✨';

    cont.appendChild(p);

    // Animar después de un microframe
    requestAnimationFrame(() => {
      p.style.transform = `translate(${dx}px, ${dy + 100}px) rotate(${Math.random() * 720 - 360}deg) scale(${Math.random() * 0.5 + 0.5})`;
      p.style.opacity = '0';
    });
  }

  setTimeout(() => cont.remove(), (opts.duracion || 1) * 1000 + 100);
}

function confeti(x, y) {
  crearParticulas({ x, y, emoji: '🎉', cantidad: 10, esparcimiento: 120, duracion: 1.2 });
  crearParticulas({ x, y, emoji: '✨', cantidad: 8, esparcimiento: 100, duracion: 1.0 });
  crearParticulas({ x, y, emoji: '⭐', cantidad: 6, esparcimiento: 80, duracion: 1.4 });
}

function corazones(x, y) {
  crearParticulas({ x, y, emoji: '💖', cantidad: 8, esparcimiento: 80, duracion: 1.3 });
  crearParticulas({ x, y, emoji: '💕', cantidad: 6, esparcimiento: 60, duracion: 1.0 });
}

function asco(x, y) {
  crearParticulas({ x, y, emoji: '💢', cantidad: 6, esparcimiento: 80, duracion: 0.8 });
  crearParticulas({ x, y, emoji: '🤢', cantidad: 4, esparcimiento: 60, duracion: 0.9 });
}

function brillitos(x, y) {
  crearParticulas({ x, y, emoji: '✨', cantidad: 12, esparcimiento: 90, duracion: 0.9 });
}


/* ========== MONEDAS VOLANDO AL HUD ========== */

function monedasVolando(xOrigen, yOrigen, cantidad) {
  const hudMonedas = document.getElementById('hud-monedas');
  if (!hudMonedas) return;
  const r = hudMonedas.getBoundingClientRect();
  const xDest = r.left + r.width / 2;
  const yDest = r.top + r.height / 2;

  for (let i = 0; i < (cantidad || 5); i++) {
    setTimeout(() => {
      const moneda = document.createElement('div');
      moneda.style.cssText = `
        position: fixed; left: ${xOrigen}px; top: ${yOrigen}px;
        font-size: 28px; pointer-events: none; z-index: 9999;
        transition: left 0.7s cubic-bezier(.4,0,.6,1), top 0.7s cubic-bezier(.4,0,.6,1), opacity 0.7s ease-in;
        will-change: left, top;
      `;
      moneda.textContent = '🪙';
      document.body.appendChild(moneda);

      requestAnimationFrame(() => {
        moneda.style.left = xDest + 'px';
        moneda.style.top = yDest + 'px';
        moneda.style.opacity = '0';
      });
      setTimeout(() => {
        sonidoMoneda();
        // Pulso en el HUD
        hudMonedas.style.transition = 'transform 0.2s ease';
        hudMonedas.style.transform = 'scale(1.4)';
        setTimeout(() => hudMonedas.style.transform = 'scale(1)', 200);
      }, 700);
      setTimeout(() => moneda.remove(), 1000);
    }, i * 100);
  }
}


/* ========== EFECTO DE SHAKE (pantalla tiembla) ========== */

function temblarPantalla(intensidad, duracion) {
  const main = document.querySelector('.heladeria');
  if (!main) return;
  let pasos = 0;
  const max = Math.floor((duracion || 400) / 40);
  const int = intensidad || 6;
  const i = setInterval(() => {
    main.style.transform = `translate(${(Math.random() - 0.5) * int}px, ${(Math.random() - 0.5) * int}px)`;
    if (++pasos >= max) {
      clearInterval(i);
      main.style.transform = '';
    }
  }, 40);
}


/* ========== FLASH DE COLOR EN PANTALLA ========== */

function flashColor(color, duracion) {
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed; inset: 0;
    background: ${color || 'rgba(255, 255, 255, 0.4)'};
    pointer-events: none; z-index: 9998;
    transition: opacity ${duracion || 0.4}s ease;
    opacity: 1;
  `;
  document.body.appendChild(flash);
  requestAnimationFrame(() => flash.style.opacity = '0');
  setTimeout(() => flash.remove(), (duracion || 0.4) * 1000 + 50);
}
