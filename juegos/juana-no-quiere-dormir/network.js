/* ============================================================
   "Juana no quiere dormir" — Capa de red (P2P con PeerJS)
   ------------------------------------------------------------
   Permite jugar a distancia entre 2 computadores sin servidor
   propio. Usa PeerJS (broker público gratuito) para signaling
   y luego abre un canal WebRTC directo entre los dos peers.

   Protocolo:
     CLIENTE → HOST: { tipo: 'input', dir: 'arriba'|'abajo'|... }
     HOST → CLIENTE: { tipo: 'state', t, juana, papa, mapa, ... }
     HOST → CLIENTE: { tipo: 'init', tuRol: 'juana'|'papa' }

   Roles:
     - HOST  → corre toda la lógica del juego, manda estado 30fps
     - CLIENTE → solo manda inputs y renderiza estado recibido
   ============================================================ */

const RED = {
  modo: 'local',         // 'local' | 'online_host' | 'online_cliente'
  miRol: null,           // 'juana' | 'papa'  (solo en online)
  peer: null,            // instancia PeerJS
  conexion: null,        // DataConnection
  codigoSala: null,      // string corto tipo "JUANA-A3F2"

  // Buffer del último input recibido del cliente (host lo aplica)
  inputRemoto: null,

  // Estado recibido del host (cliente lo renderiza tal cual)
  estadoRemoto: null,

  // Timer de broadcast (host envía estado a 30fps)
  ultimoBroadcast: 0,
  intervaloBroadcast: 1000 / 30,
};

/* ----- Generación de códigos amigables ----- */
function generarCodigoSala() {
  const adj = ['LUNA', 'ESTRELLA', 'SOPA', 'CUENTO', 'PIJAMA', 'COJÍN'];
  const palabra = adj[Math.floor(Math.random() * adj.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `JUANA-${palabra}-${num}`;
}

/* ----- Crear sala (HOST) ----- */
function crearSala(rolElegido, onListo, onConectado, onError) {
  RED.modo = 'online_host';
  RED.miRol = rolElegido;
  RED.codigoSala = generarCodigoSala();

  // PeerJS usa un broker público para registrar nuestro ID
  try {
    RED.peer = new Peer(RED.codigoSala, { debug: 1 });
  } catch (e) {
    onError && onError('No se pudo iniciar PeerJS: ' + e.message);
    return;
  }

  RED.peer.on('open', (id) => {
    console.log('[RED] Sala creada con ID:', id);
    onListo && onListo(id);
  });

  RED.peer.on('connection', (conn) => {
    console.log('[RED] ¡Cliente conectado!');
    RED.conexion = conn;

    conn.on('open', () => {
      // Anunciar al cliente cuál es su rol (el opuesto al del host)
      const rolCliente = RED.miRol === 'juana' ? 'papa' : 'juana';
      conn.send({ tipo: 'init', tuRol: rolCliente });
      onConectado && onConectado();
    });

    conn.on('data', (msg) => recibirDeCliente(msg));
    conn.on('close', () => onError && onError('Conexión cerrada'));
  });

  RED.peer.on('error', (err) => {
    console.error('[RED]', err);
    if (err.type === 'unavailable-id') {
      // Reintentar con otro código
      onError && onError('Código ocupado, prueba otra vez');
    } else {
      onError && onError(err.type + ': ' + err.message);
    }
  });
}

/* ----- Unirse a sala (CLIENTE) ----- */
function unirseASala(codigo, onConectado, onError) {
  RED.modo = 'online_cliente';
  RED.codigoSala = codigo.trim().toUpperCase();

  try {
    RED.peer = new Peer({ debug: 1 });
  } catch (e) {
    onError && onError('No se pudo iniciar PeerJS: ' + e.message);
    return;
  }

  RED.peer.on('open', () => {
    console.log('[RED] Conectando a sala:', RED.codigoSala);
    RED.conexion = RED.peer.connect(RED.codigoSala, { reliable: false });

    RED.conexion.on('open', () => {
      console.log('[RED] ¡Conectado al host!');
    });

    RED.conexion.on('data', (msg) => {
      if (msg.tipo === 'init') {
        RED.miRol = msg.tuRol;
        console.log('[RED] Mi rol asignado:', RED.miRol);
        onConectado && onConectado(RED.miRol);
      } else if (msg.tipo === 'state') {
        RED.estadoRemoto = msg;
      }
    });

    RED.conexion.on('close', () => onError && onError('Se cerró la sala'));
    RED.conexion.on('error', (e) => onError && onError(e.message || 'Error de conexión'));
  });

  RED.peer.on('error', (err) => {
    console.error('[RED]', err);
    let msg = err.message || err.type;
    if (err.type === 'peer-unavailable') msg = 'No encontré esa sala. ¿Código bien escrito?';
    onError && onError(msg);
  });
}

/* ----- Cliente → Host: enviar input ----- */
function enviarInput(direccionNombre) {
  if (RED.modo !== 'online_cliente') return;
  if (!RED.conexion || !RED.conexion.open) return;
  RED.conexion.send({ tipo: 'input', dir: direccionNombre });
}

/* ----- Host: recibir input del cliente ----- */
function recibirDeCliente(msg) {
  if (msg.tipo === 'input') {
    RED.inputRemoto = msg.dir;
  }
}

/* ----- Host → Cliente: enviar snapshot del estado ----- */
function broadcastEstado(juego) {
  if (RED.modo !== 'online_host') return;
  if (!RED.conexion || !RED.conexion.open) return;
  const ahora = performance.now();
  if (ahora - RED.ultimoBroadcast < RED.intervaloBroadcast) return;
  RED.ultimoBroadcast = ahora;

  // Snapshot compacto (mapa solo si cambió sería mejor; por simplicidad mando completo)
  RED.conexion.send({
    tipo: 'state',
    t: juego.tiempo,
    estado: juego.estado,
    nivelIndex: juego.nivelIndex,
    puntaje: juego.puntaje,
    vidas: juego.vidas,
    coleccionables: juego.coleccionables,
    sopaActiva: juego.sopaActiva,
    sopaTiempoRestante: juego.sopaTiempoRestante,
    mapa: juego.mapa,
    juana: {
      x: juego.juana.x, y: juego.juana.y,
      col: juego.juana.col, fila: juego.juana.fila,
      dir: juego.juana.dir ? juego.juana.dir.nombre : null,
      escudo: juego.juana.escudo
    },
    papa: {
      x: juego.papa.x, y: juego.papa.y,
      col: juego.papa.col, fila: juego.papa.fila,
      dir: juego.papa.dir ? juego.papa.dir.nombre : null,
      asustado: juego.papa.asustado,
      paralizadoFrames: juego.papa.paralizadoFrames
    }
  });
}

/* ----- Cerrar conexión y volver a local ----- */
function desconectar() {
  if (RED.conexion) try { RED.conexion.close(); } catch(e) {}
  if (RED.peer)     try { RED.peer.destroy(); } catch(e) {}
  RED.conexion = null;
  RED.peer = null;
  RED.modo = 'local';
  RED.miRol = null;
  RED.inputRemoto = null;
  RED.estadoRemoto = null;
}
