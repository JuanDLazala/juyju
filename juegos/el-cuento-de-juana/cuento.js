/* ============================================================
   "Juana y Munra" — Cuento interactivo
   ------------------------------------------------------------
   Cuento educativo-emocional para enseñar a una niña a
   reconocer y administrar la ira. Diseñado bajo principios de:
     - Terapia narrativa (externalización del problema)
     - "Name it to tame it" (Dan Siegel, El cerebro del niño)
     - Validación antes de redirección
     - Sin moralizar, sin castigar elecciones

   Munra es la dragoncita que vive dentro del corazón de Juana.
   El cuento NO le dice a Juana que sentir rabia esté mal — le
   muestra cómo se siente después de elegir cada respuesta y le
   enseña 5 herramientas reales de auto-regulación.
   ============================================================ */


/* ========== 1. SVG DE MUNRA (la dragoncita kawaii) ========== */

function svgMunra(estado) {
  // estado: 'tranquila' | 'humeando' | 'furiosa' | 'calmada' | 'feliz'
  return `
<svg viewBox="0 0 200 200" class="munra-svg ${estado || ''}" xmlns="http://www.w3.org/2000/svg">
  <!-- Humo (solo visible cuando humeando) -->
  <g class="humo">
    <circle cx="70" cy="40" r="6" fill="#bcc7e0" opacity="0.7"/>
    <circle cx="85" cy="28" r="5" fill="#bcc7e0" opacity="0.6"/>
    <circle cx="100" cy="22" r="7" fill="#bcc7e0" opacity="0.5"/>
  </g>

  <!-- Brillos (solo visibles cuando feliz) -->
  <g class="brillos">
    <text x="30" y="50" font-size="22">✨</text>
    <text x="160" y="60" font-size="22">✨</text>
    <text x="25" y="140" font-size="18">⭐</text>
    <text x="165" y="130" font-size="18">⭐</text>
  </g>

  <!-- Cola enrollada (atrás) -->
  <path d="M 145 140 Q 175 130 175 105 Q 175 80 155 85"
        stroke="#d96aa1" stroke-width="14" fill="none" stroke-linecap="round" class="cola"/>
  <circle cx="155" cy="85" r="6" fill="#ffd866"/>

  <!-- Alitas -->
  <path d="M 60 90 Q 35 75 30 100 Q 40 95 60 100 Z" fill="#d96aa1" class="ala"/>
  <path d="M 140 90 Q 165 75 170 100 Q 160 95 140 100 Z" fill="#d96aa1" class="ala"/>

  <!-- CUERPO (pera) -->
  <ellipse cx="100" cy="125" rx="35" ry="38" fill="#ffb0d4" class="cuerpo"/>
  <!-- Vientre claro -->
  <ellipse cx="100" cy="135" rx="22" ry="25" fill="#fff0e0" class="vientre"/>
  <!-- Escamitas en el vientre -->
  <path d="M 90 125 q 5 4 10 0 q 5 4 10 0" stroke="#ffd4b8" stroke-width="1.5" fill="none"/>
  <path d="M 88 138 q 6 4 12 0 q 6 4 12 0" stroke="#ffd4b8" stroke-width="1.5" fill="none"/>

  <!-- Patitas -->
  <ellipse cx="85" cy="160" rx="10" ry="6" fill="#d96aa1"/>
  <ellipse cx="115" cy="160" rx="10" ry="6" fill="#d96aa1"/>

  <!-- CABEZA (grande, chibi) -->
  <circle cx="100" cy="85" r="42" fill="#ffb0d4" class="cabeza"/>

  <!-- Cuernitos -->
  <path d="M 78 55 L 82 42 L 86 55 Z" fill="#ffd866"/>
  <path d="M 122 55 L 118 42 L 114 55 Z" fill="#ffd866"/>

  <!-- Orejas (pequeñas, lateral) -->
  <ellipse cx="64" cy="78" rx="5" ry="9" fill="#d96aa1" transform="rotate(-20 64 78)"/>
  <ellipse cx="136" cy="78" rx="5" ry="9" fill="#d96aa1" transform="rotate(20 136 78)"/>

  <!-- Ojos manga grandes (sclera) -->
  <ellipse cx="85" cy="85" rx="8" ry="10" fill="#fff"/>
  <ellipse cx="115" cy="85" rx="8" ry="10" fill="#fff"/>
  <!-- Iris -->
  <circle cx="85" cy="87" r="6" fill="#3a1f10"/>
  <circle cx="115" cy="87" r="6" fill="#3a1f10"/>
  <!-- Pupila -->
  <circle cx="85" cy="87" r="3" fill="#000"/>
  <circle cx="115" cy="87" r="3" fill="#000"/>
  <!-- Brillos en los ojos (estilo manga) -->
  <circle cx="87" cy="83" r="2.5" fill="#fff"/>
  <circle cx="117" cy="83" r="2.5" fill="#fff"/>
  <circle cx="83" cy="89" r="1" fill="#fff" opacity="0.7"/>
  <circle cx="113" cy="89" r="1" fill="#fff" opacity="0.7"/>

  <!-- Mejillas rosadas -->
  <ellipse cx="75" cy="98" rx="5" ry="3" fill="#ff7fb6" opacity="0.7" class="mejillas"/>
  <ellipse cx="125" cy="98" rx="5" ry="3" fill="#ff7fb6" opacity="0.7" class="mejillas"/>

  <!-- Boquita pequeña -->
  <path d="M 95 108 Q 100 112 105 108" stroke="#3a1f10" stroke-width="1.5" fill="none" stroke-linecap="round" class="boca"/>

  <!-- Fuego (solo visible cuando furiosa) -->
  <g class="fuego" transform="translate(100, 113)">
    <path d="M 0 0 Q -8 -8 -4 -18 Q 0 -10 4 -18 Q 8 -8 0 0 Z" fill="#ff7a3d"/>
    <path d="M 0 -3 Q -4 -8 -2 -14 Q 0 -8 2 -14 Q 4 -8 0 -3 Z" fill="#ffd866"/>
  </g>
</svg>`;
}


/* ========== 2. GUION: CAPÍTULOS Y ESCENAS ==========
   Cada capítulo tiene:
     - titulo
     - texto narrativo (la situación)
     - munraEstado: cómo se ve Munra mientras lees
     - munraDice (opcional): frase corta en globo
     - opciones[]: 3 formas de reaccionar
       - emoji, texto, miniJuego (o null), consecuencia, reflexion
       - trucoAprendido: nombre del truco si la opción es de regulación
============================================================ */

const CAPITULOS = [

  // --- INTRODUCCIÓN ---
  {
    id: 'intro',
    titulo: 'Conociendo a Munra',
    munraEstado: 'tranquila',
    munraDice: '¡Hola, Juana! 💕',
    texto: `Esta es <strong>Munra</strong>. Vive dentro de tu corazón, mi amor.
            <br><br>
            Es una dragoncita guardiana. La mayor parte del tiempo está tranquila y feliz.
            Pero cuando algo no sale como esperas, cuando alguien te dice <em>"no"</em>,
            o cuando algo se rompe… <strong>Munra se calienta</strong>. Y empieza a echar fuego.
            <br><br>
            Eso no es malo. El fuego de Munra te avisa que algo te duele.
            Pero un dragón sin entrenar quema cosas que no debería.
            <br><br>
            <strong>Por eso necesita tu ayuda</strong>. Y tú la suya.
            Vamos a aprender juntas 5 trucos mágicos para que Munra y tú sean amigas para siempre.`,
    soloContinuar: true
  },

  // --- CAPÍTULO 1: SUPERMERCADO ---
  {
    id: 'supermercado',
    titulo: 'En el supermercado',
    munraEstado: 'humeando',
    munraDice: 'Mmm… algo se siente caliente…',
    texto: `Papá te lleva al supermercado. Vas caminando por el pasillo de las galletas
            y de repente ves tus favoritas: las de chocolate con corazoncitos rosados. 🍪💕
            <br><br>
            Le pides a papá si te las puede comprar. Papá te mira con cariño y te dice:
            <br><br>
            <em>"Hoy no, mi amor. Ya tenemos postre en la casa."</em>
            <br><br>
            Munra se empieza a calentar dentro de tu pecho. Sientes una bola caliente en la barriga.
            <strong>¿Qué haces?</strong>`,
    opciones: [
      {
        emoji: '😤',
        texto: 'Gritar fuerte: "¡SIEMPRE ME DICES QUE NO!" y patalear.',
        miniJuego: null,
        consecuencia: `Munra echó tanto fuego que todo el supermercado se quedó mirando.
                       Papá se puso muy serio. Te dijo: <em>"así no, Juana"</em>
                       y te llevó al carro sin las galletas.
                       <br><br>
                       Munra se siente poderosa por un momento… pero después, en el carro,
                       sientes algo raro en la barriga. Una especie de tristeza.`,
        reflexion: `🐉 Munra te dice: "Cuando echo mucho fuego, después me siento cansada y triste.
                    ¿Tú también?"`
      },
      {
        emoji: '💬',
        texto: 'Decirle a papá qué sientes: "Me dio rabia que me dijeras que no."',
        miniJuego: 'decir',
        consecuencia: `Papá te miró, se agachó a tu altura y te dijo:
                       <em>"Entiendo, mi amor. Sí da rabia cuando uno quiere algo y no lo tiene.
                       Gracias por contármelo en vez de gritarme."</em>
                       <br><br>
                       Munra se enfrió un poquito. Las galletas siguen sin estar en el carrito,
                       pero algo se sintió bien.`,
        reflexion: `🐉 Munra te dice: "Cuando me pones nombre, dejo de quemar tanto.
                    Las palabras son agua para mí."`,
        trucoAprendido: 'Decir lo que siento'
      },
      {
        emoji: '🐋',
        texto: 'Respirar profundo como una ballena: inhalar… exhalar…',
        miniJuego: 'respirar',
        consecuencia: `Hiciste 4 respiraciones grandes. Después de la última,
                       sentiste que la bola caliente en la barriga se hizo más pequeña.
                       <br><br>
                       Papá te miró sorprendido: <em>"¡Wow, qué grande estás!"</em>
                       Las galletas siguen ahí, en el estante. Pero tú ya no las necesitas tanto.`,
        reflexion: `🐉 Munra te dice: "Respirar es mi truco favorito. El aire me enfría por dentro."`,
        trucoAprendido: 'Respirar como ballena'
      }
    ]
  },

  // --- CAPÍTULO 2: AMIGA ROMPE JUGUETE ---
  {
    id: 'juguete',
    titulo: 'El juguete favorito',
    munraEstado: 'humeando',
    munraDice: '¡Ay! Eso dolió…',
    texto: `Tu amiga vino a tu casa a jugar. Le prestaste tu unicornio favorito,
            el que te regalaron en tu cumpleaños. 🦄
            <br><br>
            Mientras jugaban, tu amiga lo lanzó al aire sin querer
            y… se le cayó. El cuerno se rompió. ¡Crack!
            <br><br>
            Tu amiga se asustó y dijo: <em>"¡Perdón, perdón!"</em>
            <br><br>
            Munra empezó a humear MUCHO. Sientes que la cara se te pone roja y caliente.
            <strong>¿Qué haces?</strong>`,
    opciones: [
      {
        emoji: '😡',
        texto: '"¡Me lo rompiste a propósito! ¡Vete de mi casa!"',
        miniJuego: null,
        consecuencia: `Tu amiga se puso a llorar y llamó a su mamá para que viniera por ella.
                       Mamá te miró triste y te dijo que las amigas a veces se equivocan sin querer.
                       <br><br>
                       Te quedaste sola en tu cuarto con el unicornio roto en la mano.
                       Munra está agotada de tanto fuego.`,
        reflexion: `🐉 Munra te dice: "El fuego no arregló el cuerno. Y ahora tu amiga
                    se fue triste. ¿Cómo te sientes tú?"`
      },
      {
        emoji: '🏃',
        texto: 'Salir corriendo y mover toda la energía con los pies.',
        miniJuego: 'mover',
        consecuencia: `Saliste al patio y corriste como un rayo. Diste 10 vueltas alrededor del árbol
                       hasta quedar sin aliento. Munra echó todo el fuego por las piernas.
                       <br><br>
                       Cuando volviste, viste a tu amiga llorando con el unicornio.
                       La abrazaste. Mamá dijo que podían pegar el cuerno juntas con superglue.`,
        reflexion: `🐉 Munra te dice: "A veces tengo TANTA energía que necesito salir corriendo.
                    El cuerpo es muy sabio."`,
        trucoAprendido: 'Mover el fuego'
      },
      {
        emoji: '🐋',
        texto: 'Respirar 4 veces antes de decir nada.',
        miniJuego: 'respirar',
        consecuencia: `Cerraste los ojos un momento. Inhalaste fuerte… exhalaste despacio…
                       Cuando abriste los ojos, tu amiga seguía ahí, asustada, con el unicornio en la mano.
                       <br><br>
                       Le dijiste: <em>"Me da mucha tristeza que se rompiera.
                       Pero sé que no fue a propósito."</em>
                       Se abrazaron. Mamá dijo que lo podían arreglar juntas.`,
        reflexion: `🐉 Munra te dice: "Esos 4 respiros me dieron tiempo para enfriarme.
                    Y a ti te dieron tiempo para pensar."`,
        trucoAprendido: 'Respirar como ballena'
      }
    ]
  },

  // --- CAPÍTULO 3: HORA DE DORMIR ---
  {
    id: 'dormir',
    titulo: 'La hora de dormir',
    munraEstado: 'humeando',
    munraDice: 'No quiero ir a la camaaa…',
    texto: `Estás jugando muy entretenida en el piso de la sala con tus muñecos.
            Acabas de inventarte una historia donde la princesa salva al dragón
            (porque ya sabes que los dragones son buenos 🐉).
            <br><br>
            Papá viene y te dice: <em>"Mi amor, ya es hora de dormir. Recoge los juguetes."</em>
            <br><br>
            ¡Pero estabas justo en la mejor parte! Munra se enciende de nuevo.
            Sientes ganas de tirarte al piso y decir "¡NO!"
            <br><br>
            <strong>¿Qué haces?</strong>`,
    opciones: [
      {
        emoji: '😢',
        texto: 'Tirarte al piso, llorar y gritar "¡5 minutos más!"',
        miniJuego: null,
        consecuencia: `Lloraste y pataleaste un buen rato. Papá esperó pacientemente
                       sin gritarte (papá también está aprendiendo a respirar).
                       Después de un rato te calmaste sola, pero ya estabas tan cansada
                       de llorar que tampoco disfrutaste la cama.`,
        reflexion: `🐉 Munra te dice: "A veces, después de tanto fuego, una se queda vacía.
                    No me gusta esa sensación."`
      },
      {
        emoji: '💬',
        texto: 'Decirle a papá: "Estoy en la mejor parte. ¿Puedo 5 minutos más?"',
        miniJuego: 'decir',
        consecuencia: `Papá pensó un momento y te dijo: <em>"Bueno, 5 minutos exactos.
                       Pero después recoges sin chistar, ¿trato hecho?"</em>
                       <br><br>
                       <strong>¡Trato hecho!</strong> Terminaste tu historia
                       y recogiste rapidito. Te fuiste a la cama feliz.`,
        reflexion: `🐉 Munra te dice: "Las palabras también son magia. A veces uno consigue
                    lo que quiere solo… ¡pidiéndolo bien!"`,
        trucoAprendido: 'Decir lo que siento'
      },
      {
        emoji: '⭐',
        texto: 'Cerrar los ojos y contar 10 estrellitas en mi mente.',
        miniJuego: 'estrellas',
        consecuencia: `Cerraste los ojos. Una… dos… tres… diez estrellas.
                       Cuando terminaste de contar, Munra se había enfriado.
                       <br><br>
                       Le dijiste a papá: <em>"Está bien, ya voy."</em>
                       Papá te abrazó tan fuerte que sentiste su corazón.`,
        reflexion: `🐉 Munra te dice: "Contar despacito me hipnotiza. Es como un truco mágico
                    para mí."`,
        trucoAprendido: 'Contar estrellas'
      }
    ]
  },

  // --- CAPÍTULO 4: PLAN CANCELADO ---
  {
    id: 'parque',
    titulo: 'El día que se canceló',
    munraEstado: 'humeando',
    munraDice: 'Pero… pero… ¡habíamos planeado!',
    texto: `Llevabas toda la semana esperando el sábado para ir al parque
            con papá y mamá. Tenías planeado el columpio, el rodadero,
            comer helado de fresa, todo.
            <br><br>
            Sábado en la mañana te despiertas, corres a la ventana y…
            <strong>está lloviendo a cántaros</strong>. ☔
            <br><br>
            Mamá te dice: <em>"Mi amor, hoy no podemos ir al parque. Lo dejamos para la próxima semana, ¿bueno?"</em>
            <br><br>
            Munra se prende como una vela. Sientes que el mundo es injusto.
            <strong>¿Qué haces?</strong>`,
    opciones: [
      {
        emoji: '😭',
        texto: '"¡No es justo! ¡Es un día horrible! ¡Odio la lluvia!"',
        miniJuego: null,
        consecuencia: `Lloraste mucho rato. Te encerraste en tu cuarto.
                       Mamá vino, te abrazó sin decir nada, y se quedó contigo hasta que te calmaste.
                       <br><br>
                       Después de un rato te dio hambre y saliste. Pero el sábado se sintió
                       todo gris, no solo por la lluvia.`,
        reflexion: `🐉 Munra te dice: "Tienes razón, ES injusto que llueva justo hoy.
                    Sentir rabia por eso es válido. Pero la lluvia no se va con rabia."`
      },
      {
        emoji: '🫂',
        texto: 'Pedirle a Munra un abrazo grande dentro de mí.',
        miniJuego: 'abrazar',
        consecuencia: `Te sentaste en el sofá y cerraste los ojos.
                       Te pusiste la mano en el corazón y le dijiste a Munra:
                       <em>"Sé que estás triste. Yo también. Te abrazo."</em>
                       <br><br>
                       Munra se sintió escuchada. Después fuiste a la cocina y le propusiste a mamá
                       hacer galletas. Fue un sábado distinto, pero bonito.`,
        reflexion: `🐉 Munra te dice: "Cuando me abrazas, recuerdo que no estoy sola.
                    Eres la mejor compañera que tengo."`,
        trucoAprendido: 'Abrazar a Munra'
      },
      {
        emoji: '💬',
        texto: 'Decirle a mamá: "Estoy muy triste y muy brava."',
        miniJuego: 'decir',
        consecuencia: `Mamá se sentó contigo. Te dijo: <em>"Te entiendo, mi amor.
                       A mí también me da rabia cuando los planes cambian."</em>
                       <br><br>
                       Pasaron un rato hablando de qué cosas las ponen tristes.
                       Después armaron un fuerte con las cobijas y vieron una película juntas.`,
        reflexion: `🐉 Munra te dice: "Cuando dices lo que sientes, los grandes te escuchan.
                    Y a veces se ponen igual de tristes que tú."`,
        trucoAprendido: 'Decir lo que siento'
      }
    ]
  },

  // --- CAPÍTULO 5: DIBUJO QUE NO SALIÓ ---
  {
    id: 'dibujo',
    titulo: 'El dibujo de la unicornia',
    munraEstado: 'humeando',
    munraDice: '¡Casi, casi…!',
    texto: `Llevas como media hora dibujando una unicornia con alas en un papel grande.
            Le dibujaste el cuerno, las patas, las plumas… está quedando hermosa.
            <br><br>
            Vas a dibujarle los ojitos manga, los más importantes…
            y se te resbala el marcador. <strong>Una raya gruesa cruzó toda la cara.</strong> 😱
            <br><br>
            Munra se enciende. Quieres romper el papel en mil pedazos.
            <strong>¿Qué haces?</strong>`,
    opciones: [
      {
        emoji: '🗑️',
        texto: 'Arrugar el papel y tirarlo a la basura.',
        miniJuego: null,
        consecuencia: `Hiciste una pelota gigante con tu dibujo y la tiraste lejos.
                       Munra echó un fuegote.
                       <br><br>
                       Pero después, cuando se te pasó la rabia, fuiste a la basura,
                       sacaste el papel y trataste de extenderlo otra vez. Pero ya estaba muy arrugado.
                       Diste un suspiro grande.`,
        reflexion: `🐉 Munra te dice: "A veces el fuego destruye cosas que nos importan.
                    Aprender a parar antes es difícil pero se puede."`
      },
      {
        emoji: '🐋',
        texto: 'Respirar profundo antes de hacer nada con el dibujo.',
        miniJuego: 'respirar',
        consecuencia: `Cerraste los ojos. Inhalaste… exhalaste…
                       Cuando los abriste, miraste la raya con calma.
                       <br><br>
                       Te diste cuenta de que podías convertir la raya en una <strong>cinta</strong>
                       que la unicornia llevaba en el pelo. La unicornia quedó aún más hermosa
                       que como la habías planeado.`,
        reflexion: `🐉 Munra te dice: "A veces los errores se vuelven la mejor parte.
                    Solo hay que mirarlos sin tanto fuego."`,
        trucoAprendido: 'Respirar como ballena'
      },
      {
        emoji: '⭐',
        texto: 'Contar 10 estrellas mientras la rabia baja.',
        miniJuego: 'estrellas',
        consecuencia: `Una… dos… tres… diez estrellas brillantes.
                       Cuando terminaste, miraste el papel de nuevo.
                       <br><br>
                       Decidiste hacer otro dibujo, pero esta vez aún mejor:
                       una unicornia <strong>con una bufanda de estrellas</strong>.
                       Y al primero le pusiste una pegatina sobre la raya.`,
        reflexion: `🐉 Munra te dice: "Cuando cuento estrellas, las cosas se ven menos grandes.
                    Es como hacer zoom hacia afuera."`,
        trucoAprendido: 'Contar estrellas'
      }
    ]
  }

];


/* ========== 3. ESTADO DEL JUEGO ========== */

const estado = {
  capituloActual: 0,           // índice en CAPITULOS
  trucosAprendidos: new Set(), // conjunto de trucos únicos
  opcionElegida: null,         // la última opción elegida
};


/* ========== 4. NAVEGACIÓN DE ESCENAS ========== */

function mostrarEscena(id) {
  document.querySelectorAll('.escena').forEach(e => e.classList.remove('activa'));
  const el = document.getElementById(id);
  if (el) el.classList.add('activa');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderizarCapitulo() {
  const cap = CAPITULOS[estado.capituloActual];
  if (!cap) { mostrarDiploma(); return; }

  // Encabezado
  document.getElementById('capitulo-numero').textContent =
    estado.capituloActual === 0 ? 'Bienvenida' : `Capítulo ${estado.capituloActual}`;
  document.getElementById('capitulo-titulo').textContent = cap.titulo;

  // Munra
  document.getElementById('munra-escena').innerHTML = svgMunra(cap.munraEstado);

  // Globo de diálogo
  const globo = document.getElementById('munra-globo');
  if (cap.munraDice) {
    globo.textContent = cap.munraDice;
    globo.classList.remove('oculto');
  } else {
    globo.classList.add('oculto');
  }

  // Texto
  document.getElementById('texto-escena').innerHTML = cap.texto;

  // Opciones
  const zona = document.getElementById('zona-opciones');
  zona.innerHTML = '';

  if (cap.soloContinuar) {
    // Capítulo de intro: solo un botón continuar
    const btn = document.createElement('button');
    btn.className = 'boton-cuento';
    btn.textContent = 'Conocer las situaciones';
    btn.dataset.accion = 'siguiente-capitulo';
    zona.appendChild(btn);
  } else if (cap.opciones) {
    cap.opciones.forEach((opc, idx) => {
      const btn = document.createElement('button');
      btn.className = 'opcion-btn';
      btn.dataset.opcion = idx;
      btn.innerHTML = `
        <span class="opcion-emoji">${opc.emoji}</span>
        <span class="opcion-texto">${opc.texto}</span>
      `;
      btn.addEventListener('click', () => elegirOpcion(idx));
      zona.appendChild(btn);
    });
  }

  mostrarEscena('escena-actual');
}

function elegirOpcion(idx) {
  const cap = CAPITULOS[estado.capituloActual];
  const opc = cap.opciones[idx];
  estado.opcionElegida = opc;

  // Si hay mini-juego, lo lanza primero; al terminar va a la consecuencia.
  if (opc.miniJuego) {
    iniciarMiniJuego(opc.miniJuego, () => mostrarConsecuencia());
  } else {
    mostrarConsecuencia();
  }
}

function mostrarConsecuencia() {
  const opc = estado.opcionElegida;

  // Munra reacciona según el tipo de elección
  let estadoMunra = 'tranquila';
  if (!opc.trucoAprendido) {
    // Eligió rabia: Munra está agotada (humeando suavemente)
    estadoMunra = 'humeando';
  } else if (opc.trucoAprendido === 'Respirar como ballena' ||
             opc.trucoAprendido === 'Contar estrellas' ||
             opc.trucoAprendido === 'Abrazar a Munra') {
    estadoMunra = 'calmada';
  } else {
    estadoMunra = 'feliz';
  }
  document.getElementById('munra-consecuencia').innerHTML = svgMunra(estadoMunra);

  document.getElementById('texto-consecuencia').innerHTML = opc.consecuencia;
  document.getElementById('texto-reflexion').innerHTML = opc.reflexion;

  // Registrar truco aprendido
  if (opc.trucoAprendido) {
    estado.trucosAprendidos.add(opc.trucoAprendido);
  }

  mostrarEscena('escena-consecuencia');
}

function siguienteCapitulo() {
  estado.capituloActual++;
  if (estado.capituloActual >= CAPITULOS.length) {
    mostrarDiploma();
  } else {
    renderizarCapitulo();
  }
}

function mostrarDiploma() {
  const zona = document.getElementById('trucos-aprendidos');
  if (estado.trucosAprendidos.size === 0) {
    zona.innerHTML = `<p style="color: #5a3a1a; font-style: italic;">
                     Esta vez seguiste tu camino. La próxima vez,
                     prueba los trucos mágicos de Munra. 💕</p>`;
  } else {
    zona.innerHTML = '<p style="color: #2a1240; font-weight: bold; margin-bottom: 12px;">Trucos que aprendiste:</p>';
    estado.trucosAprendidos.forEach(t => {
      const chip = document.createElement('span');
      chip.className = 'truco-chip';
      chip.textContent = '✨ ' + t;
      zona.appendChild(chip);
    });
  }
  mostrarEscena('escena-diploma');
}

function reiniciarCuento() {
  estado.capituloActual = 0;
  estado.trucosAprendidos.clear();
  estado.opcionElegida = null;
  mostrarEscena('escena-portada');
}


/* ========== 5. MINI-JUEGOS ========== */

let miniJuegoCallback = null;

function iniciarMiniJuego(tipo, callback) {
  miniJuegoCallback = callback;
  if (tipo === 'respirar')  miniRespirar();
  if (tipo === 'estrellas') miniEstrellas();
  if (tipo === 'decir')     miniDecir();
  if (tipo === 'mover')     miniMover();
  if (tipo === 'abrazar')   miniAbrazar();
}

function terminarMiniJuego() {
  if (miniJuegoCallback) {
    const cb = miniJuegoCallback;
    miniJuegoCallback = null;
    setTimeout(cb, 800);
  }
}

/* --- Respirar como ballena --- */
function miniRespirar() {
  mostrarEscena('mini-respirar');
  const ola = document.getElementById('ola-respirar');
  const txt = document.getElementById('texto-ola');
  const cont = document.getElementById('contador-respiros');
  let ciclo = 0;
  cont.textContent = '0';
  ola.className = 'ola';

  function ciclar() {
    if (ciclo >= 4) {
      txt.textContent = '✨ ¡Bien hecho! ✨';
      setTimeout(terminarMiniJuego, 1200);
      return;
    }
    // Inhalar (ola sube)
    txt.textContent = 'Inhala…';
    ola.classList.remove('bajando'); ola.classList.add('subiendo');
    setTimeout(() => {
      // Exhalar (ola baja)
      txt.textContent = 'Exhala…';
      ola.classList.remove('subiendo'); ola.classList.add('bajando');
      setTimeout(() => {
        ciclo++;
        cont.textContent = ciclo;
        ciclar();
      }, 4000);
    }, 4000);
  }
  setTimeout(ciclar, 600);
}

/* --- Contar estrellas --- */
function miniEstrellas() {
  mostrarEscena('mini-estrellas');
  const zona = document.getElementById('zona-estrellas');
  const cont = document.getElementById('contador-estrellas');
  zona.innerHTML = '';
  cont.textContent = '0';
  let contadas = 0;

  for (let i = 0; i < 10; i++) {
    const e = document.createElement('div');
    e.className = 'estrella-clickable';
    e.textContent = '⭐';
    e.addEventListener('click', () => {
      if (e.classList.contains('contada')) return;
      e.classList.add('contada');
      contadas++;
      cont.textContent = contadas;
      if (contadas >= 10) {
        setTimeout(terminarMiniJuego, 800);
      }
    });
    zona.appendChild(e);
  }
}

/* --- Decir lo que siento --- */
function miniDecir() {
  mostrarEscena('mini-decir');
  document.getElementById('munra-escucha').innerHTML = svgMunra('tranquila');
  const input = document.getElementById('input-sentimiento');
  const respuesta = document.getElementById('respuesta-munra');
  input.value = '';
  respuesta.classList.add('oculto');
  setTimeout(() => input.focus(), 300);
}

function munraResponde() {
  const input = document.getElementById('input-sentimiento');
  const respuesta = document.getElementById('respuesta-munra');
  const palabra = input.value.trim().toLowerCase();

  let texto;
  if (!palabra) {
    texto = `Munra te mira con cariño y espera. Cuando puedas, dile lo que sientes.`;
    respuesta.classList.remove('oculto');
    respuesta.innerHTML = texto;
    return;
  }
  // Respuesta empática según palabras comunes
  if (palabra.includes('rabia') || palabra.includes('brava') || palabra.includes('enoj')) {
    texto = `🐉 "Te entiendo. La rabia es válida. Sentirla no te hace mala, te hace humana.
            Estoy aquí contigo."`;
  } else if (palabra.includes('triste') || palabra.includes('llorar')) {
    texto = `🐉 "La tristeza es lluvia que limpia. Está bien sentirla.
            Yo te abrazo desde adentro."`;
  } else if (palabra.includes('injust') || palabra.includes('no es justo')) {
    texto = `🐉 "Tienes razón, a veces las cosas son injustas. Eso duele.
            No tienes que estar de acuerdo, pero sí podemos respirar juntas."`;
  } else if (palabra.includes('miedo') || palabra.includes('susto')) {
    texto = `🐉 "El miedo nos dice que algo importa. Yo lo cuido contigo."`;
  } else if (palabra.includes('feliz') || palabra.includes('content')) {
    texto = `🐉 "¡Qué bonito! La felicidad también vale la pena nombrarla. ✨"`;
  } else {
    texto = `🐉 "Te escucho, mi amor. Que sepas que <strong>${input.value.trim()}</strong>
            es algo válido de sentir. Estoy aquí."`;
  }
  respuesta.classList.remove('oculto');
  respuesta.innerHTML = texto;
  // Botón continuar después de 2 segundos
  setTimeout(() => {
    const cont = document.createElement('button');
    cont.className = 'boton-cuento';
    cont.textContent = 'Continuar la historia';
    cont.style.marginTop = '16px';
    cont.addEventListener('click', terminarMiniJuego);
    respuesta.appendChild(cont);
  }, 600);
}

/* --- Mover el fuego --- */
function miniMover() {
  mostrarEscena('mini-mover');
  const barra = document.getElementById('barra-energia');
  const cont = document.getElementById('contador-mover');
  let pulsaciones = 0;
  const meta = 25;
  barra.style.width = '0%';
  cont.textContent = '0';

  function manejar(e) {
    pulsaciones++;
    cont.textContent = pulsaciones;
    barra.style.width = Math.min(100, (pulsaciones / meta) * 100) + '%';
    if (pulsaciones >= meta) {
      window.removeEventListener('keydown', manejar);
      window.removeEventListener('click', manejarClick);
      cont.textContent = '✨ ¡La energía salió! ✨';
      setTimeout(terminarMiniJuego, 1000);
    }
  }
  function manejarClick(e) { manejar(e); }
  window.addEventListener('keydown', manejar);
  window.addEventListener('click', manejarClick);
}

/* --- Abrazar a Munra --- */
function miniAbrazar() {
  mostrarEscena('mini-abrazar');
  const munra = document.getElementById('munra-abrazar');
  const barra = document.getElementById('barra-abrazo');
  munra.innerHTML = svgMunra('tranquila');
  barra.style.width = '0%';

  let progreso = 0;
  let intervalo = null;
  const meta = 100;

  function comenzar() {
    if (intervalo) return;
    munra.innerHTML = svgMunra('calmada');
    intervalo = setInterval(() => {
      progreso += 2;
      barra.style.width = Math.min(100, progreso) + '%';
      if (progreso >= meta) {
        detener();
        munra.innerHTML = svgMunra('feliz');
        setTimeout(terminarMiniJuego, 1200);
      }
    }, 100);
  }
  function detener() {
    if (intervalo) { clearInterval(intervalo); intervalo = null; }
  }
  munra.addEventListener('mousedown', comenzar);
  munra.addEventListener('touchstart', (e) => { e.preventDefault(); comenzar(); });
  munra.addEventListener('mouseup', () => { if (progreso < meta) { detener(); progreso = Math.max(0, progreso - 10); barra.style.width = progreso + '%'; munra.innerHTML = svgMunra('tranquila'); } });
  munra.addEventListener('mouseleave', () => { if (progreso < meta) { detener(); } });
  munra.addEventListener('touchend', () => { if (progreso < meta) { detener(); } });
}


/* ========== 6. ACCIONES DE BOTONES ========== */

document.addEventListener('click', (e) => {
  const accion = e.target.dataset.accion;
  if (!accion) return;

  if (accion === 'empezar') {
    estado.capituloActual = 0;
    renderizarCapitulo();
  } else if (accion === 'siguiente-capitulo') {
    siguienteCapitulo();
  } else if (accion === 'reiniciar') {
    reiniciarCuento();
  } else if (accion === 'munra-responde') {
    munraResponde();
  }
});

// Permitir Enter en el input de "decir"
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement &&
      document.activeElement.id === 'input-sentimiento') {
    munraResponde();
  }
});


/* ========== 7. ARRANQUE ========== */

document.addEventListener('DOMContentLoaded', () => {
  // Dibujar Munra en la portada
  document.getElementById('munra-portada').innerHTML = svgMunra('tranquila');
});
