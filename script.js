/* ===================== AUDIOS ===================== */
const audioInicio = document.getElementById('audioInicio');
const audioFestejar = document.getElementById('audioFestejar');

function playSound(audio) {
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Los navegadores bloquean autoplay sin interacción
  });
}

/* ===================== CONFETI ===================== */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let particles = [];
let animId = null;
let running = false;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(first = false) {
    this.x = Math.random() * canvas.width;
    this.y = first ? Math.random() * canvas.height - canvas.height : -20;
    this.w = Math.random() * 10 + 5;
    this.h = Math.random() * 6 + 3;
    this.vx = Math.random() * 5 - 2.5;
    this.vy = Math.random() * 3.5 + 2.2;
    this.rot = Math.random() * 360;
    this.vr = Math.random() * 12 - 6;
    this.color = `hsl(${Math.random() * 50 + 330}, 90%, 65%)`;
    this.shape = Math.random() > 0.55 ? 'rect' : 'circle';
    this.alpha = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.vr;
    if (this.y > canvas.height + 30) this.reset();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rot * Math.PI) / 180);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    }
    ctx.restore();
  }
}

function createParticles(n = 120) {
  particles = [];
  for (let i = 0; i < n; i++) particles.push(new Particle());
}

function loop() {
  if (!running) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  animId = requestAnimationFrame(loop);
}

function startConfetti(ms = 5500) {
  createParticles(130);
  running = true;
  loop();
  setTimeout(() => {
    running = false;
    cancelAnimationFrame(animId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, ms);
}

/* ===================== GLOBOS ===================== */
function createBalloons() {
  const container = document.getElementById('balloons');
  const positions = [
    { top: '6%', left: '5%', delay: '0s', size: '42px' },
    { top: '12%', right: '7%', delay: '1.4s', size: '36px' },
    { bottom: '16%', left: '9%', delay: '2.6s', size: '48px' },
    { bottom: '10%', right: '10%', delay: '0.9s', size: '40px' },
    { top: '42%', left: '3%', delay: '3.8s', size: '34px' },
    { top: '55%', right: '4%', delay: '2.1s', size: '38px' }
  ];

  positions.forEach(pos => {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.textContent = '🎈';
    Object.assign(b.style, {
      top: pos.top || '',
      bottom: pos.bottom || '',
      left: pos.left || '',
      right: pos.right || '',
      fontSize: pos.size,
      animationDelay: pos.delay
    });
    container.appendChild(b);
  });
}

/* ===================== CORAZONES ===================== */
function launchHearts(count = 18) {
  const box = document.getElementById('hearts');
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'heart';
      h.textContent = Math.random() > 0.45 ? '❤️' : '💖';
      h.style.left = Math.random() * 100 + 'vw';
      h.style.bottom = '-40px';
      h.style.fontSize = (Math.random() * 16 + 16) + 'px';
      h.style.animationDuration = (Math.random() * 2.8 + 4.2) + 's';
      box.appendChild(h);
      setTimeout(() => h.remove(), 7500);
    }, i * 150);
  }
}

/* ===================== MENSAJES + TYPEWRITER ===================== */
const messages = [
  `Hoy celebramos a una persona increíble.<br>Que este año te traiga sonrisas,<br>sueños cumplidos y mucho amor.`,
  `Linda, que la vida te regale<br>momentos mágicos, abrazos sinceros<br>y todas las razones para brillar.`,
  `Eres luz, eres alegría, eres única.<br>Que este cumpleaños sea el inicio<br>de tu mejor capítulo todavía.`,
  `Hoy brillas más que nunca.<br>Que los días que vienen te traigan<br>salud, paz y felicidad infinita.`,
  `Gracias por ser exactamente como eres.<br>Que este nuevo año te envuelva<br>en amor, éxito y risas sin fin.`
];

let msgIndex = 0;
const messageEl = document.getElementById('message');

function typeWriter(html, speed = 26) {
  return new Promise(resolve => {
    messageEl.innerHTML = '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.innerText || temp.textContent;
    let i = 0;

    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    function type() {
      if (i < text.length) {
        let display = text.substring(0, i + 1).replace(/\n/g, '<br>');
        messageEl.innerHTML = display;
        messageEl.appendChild(cursor);
        i++;
        setTimeout(type, speed);
      } else {
        messageEl.innerHTML = html;
        resolve();
      }
    }
    type();
  });
}

async function showMessage(index) {
  await typeWriter(messages[index]);
}

/* ===================== BOTONES ===================== */
const partyBtn = document.getElementById('partyBtn');
const wishBtn = document.getElementById('wishBtn');

partyBtn.addEventListener('click', () => {
  playSound(audioFestejar);
  startConfetti(6000);
  launchHearts(22);

  if (navigator.vibrate) {
    navigator.vibrate([80, 40, 80, 40, 140]);
  }

  const original = partyBtn.innerHTML;
  partyBtn.innerHTML = '<span>¡Que lo pases increíble!</span> <span class="btn-icon">🥳</span>';
  partyBtn.disabled = true;

  setTimeout(() => {
    partyBtn.innerHTML = original;
    partyBtn.disabled = false;
  }, 3600);
});

wishBtn.addEventListener('click', async () => {
  msgIndex = (msgIndex + 1) % messages.length;
  await showMessage(msgIndex);
  launchHearts(8);
});

/* ===================== INICIO ===================== */
window.addEventListener('load', async () => {
  createBalloons();

  // Intentar reproducir sonido de inicio
  playSound(audioInicio);

  await showMessage(0);

  // Confeti suave al cargar
  setTimeout(() => startConfetti(3000), 800);
});

// Por si el autoplay está bloqueado, reproducir inicio al primer toque
document.body.addEventListener('click', function firstTouch() {
  playSound(audioInicio);
  document.body.removeEventListener('click', firstTouch);
}, { once: true });
