// ========================================
// HERO - CIRCULAR DISC NAV
// ========================================

(function initCircularHero() {
  const ring = document.getElementById('circRing');
  const centerText = document.getElementById('circCenterText');
  if (!ring || !centerText) return;

  const items = ring.querySelectorAll('.circ-item');

  items.forEach(item => {
    const target = item.getAttribute('data-target');
    const label = item.querySelector('textPath')?.textContent?.trim() || '';

    item.addEventListener('mouseenter', () => {
      ring.style.animationPlayState = 'paused';
      centerText.textContent = label;
      centerText.classList.add('active');
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });

    item.addEventListener('mouseleave', () => {
      ring.style.animationPlayState = 'running';
      centerText.textContent = 'WELCOME';
      centerText.classList.remove('active');
      item.classList.remove('active');
    });

    item.addEventListener('click', () => {
      const section = document.getElementById(target);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

// ========================================
// WEBGL ANIMATED BACKGROUND
// ========================================

(function initWebGLBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  const vsSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision highp float;
    uniform float u_time;
    uniform vec2 u_resolution;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

      float depth = 1.0 / (uv.y + 1.15);
      vec2 gridUv = vec2(uv.x * depth, depth + u_time * 0.15);

      float n = noise(gridUv * 3.5);
      float ripples = sin(gridUv.y * 18.0 + n * 8.0 + u_time * 0.5);

      float topoLine = smoothstep(0.03, 0.0, abs(ripples));

      vec3 baseColor = vec3(0.03, 0.03, 0.03);
      vec3 accentColor = vec3(0.05, 0.2, 0.05);
      vec3 neonColor = vec3(0.22, 1.0, 0.08);

      vec3 finalColor = mix(baseColor, accentColor, n * 0.6);
      finalColor += topoLine * neonColor * depth * 0.4;

      float fade = smoothstep(0.1, -1.0, uv.y);
      finalColor *= (1.0 - length(uv) * 0.45) * (1.0 - fade);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);

  const posAttrib = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posAttrib);
  gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

  const timeLoc = gl.getUniformLocation(program, 'u_time');
  const resLoc = gl.getUniformLocation(program, 'u_resolution');

  function render(time) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    gl.uniform1f(timeLoc, time * 0.001);
    gl.uniform2f(resLoc, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();

// ========================================
// NAVBAR - scroll effect & mobile toggle
// ========================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// ========================================
// TERMINAL - typing effect
// ========================================

const typedEl = document.getElementById('typedName');
const cursorEl = document.getElementById('cursor');
const outputLines = document.querySelectorAll('.output-line');
const textToType = "Hi, I'm William.";
let charIndex = 0;

function typeCharacter() {
  if (charIndex < textToType.length) {
    typedEl.textContent += textToType.charAt(charIndex);
    charIndex++;
    setTimeout(typeCharacter, 70 + Math.random() * 40);
  } else {
    // Typing done - reveal output lines
    setTimeout(revealOutputLines, 400);
  }
}

function revealOutputLines() {
  outputLines.forEach((line, i) => {
    const delay = parseInt(line.dataset.delay) || i * 200;
    setTimeout(() => {
      line.classList.remove('hidden');
      line.classList.add('visible');
    }, delay);
  });
}

// Start typing after a short delay (only on pages with the terminal)
if (typedEl) setTimeout(typeCharacter, 600);

// ========================================
// SOCIAL LINKS - random rotation on hover
// ========================================

document.querySelectorAll('.social-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const rotation = Math.random() * 20 - 10;
    item.querySelector('.social-icon-popup')
      ?.style.setProperty('--icon-rotation', rotation + 'deg');
  });
});

// ========================================
// SCROLL ANIMATIONS - fade in on scroll
// ========================================

const fadeElements = document.querySelectorAll('.section-title, .about-content, .resume-content, .social-links');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in', 'visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ========================================
// BOOKSHELF - click to open, click outside to close
// ========================================

const allContainers = document.querySelectorAll('.container');

allContainers.forEach(container => {
  container.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT') return; // ignore synthetic input click from label
    if (e.target.closest('a')) return;
    const isOpen = container.classList.contains('is-open');
    allContainers.forEach(c => c.classList.remove('is-open'));
    if (!isOpen) container.classList.add('is-open');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.container')) {
    allContainers.forEach(c => c.classList.remove('is-open'));
  }
});

// ========================================
// ROTATING NAME - cylindrical text distortion
// ========================================

(function warpNameText() {
  const items = document.querySelectorAll('.name-item');
  if (!items.length) return;

  const fnText = 'william';
  const lnText = 'harris';
  const allText = fnText + lnText;
  const N = allText.length; // 13 chars

  const R = 400;       // arc radius (px) - smaller = more curved
  const charW = 29;    // estimated char width at 3rem JetBrains Mono
  const localPersp = 280; // close perspective for strong depth effect
  const anglePerChar = (charW / R) * (180 / Math.PI);
  const totalAngle = N * anglePerChar;
  const startAngle = -totalAngle / 2;
  const cx = 250; // center of 500px-wide cylinder

  items.forEach(item => {
    item.innerHTML = '';

    // Wrapper with its own close perspective so translateZ creates real foreshortening
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: relative;
      width: 500px;
      height: 80px;
      perspective: ${localPersp}px;
    `;

    for (let i = 0; i < N; i++) {
      const thetaDeg = startAngle + (i + 0.5) * anglePerChar;
      const thetaRad = thetaDeg * Math.PI / 180;

      const x = R * Math.sin(thetaRad);
      const z = R * (Math.cos(thetaRad) - 1); // 0 at center, negative at edges

      const span = document.createElement('span');
      span.textContent = allText[i];
      span.className = i < fnText.length ? 'fn' : 'ln';
      span.style.cssText = `
        position: absolute;
        left: 0;
        top: 50%;
        width: ${charW}px;
        text-align: center;
        font-size: 3rem;
        font-weight: 700;
        font-family: 'JetBrains Mono', monospace;
        transform: translateX(${cx + x - charW / 2}px) translateY(-50%) translateZ(${z}px) rotateY(${-thetaDeg}deg);
      `;
      wrapper.appendChild(span);
    }

    item.appendChild(wrapper);
  });
})();
