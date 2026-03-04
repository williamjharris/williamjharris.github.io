// ========================================
// NAVBAR — scroll effect & mobile toggle
// ========================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

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

// ========================================
// TERMINAL — typing effect
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
    // Typing done — reveal output lines
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

// Start typing after a short delay
setTimeout(typeCharacter, 600);

// ========================================
// SOCIAL LINKS — random rotation on hover
// ========================================

document.querySelectorAll('.social-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const rotation = Math.random() * 20 - 10;
    item.querySelector('.social-icon-popup')
      ?.style.setProperty('--icon-rotation', rotation + 'deg');
  });
});

// ========================================
// SCROLL ANIMATIONS — fade in on scroll
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
// BOOKSHELF — deselect on click outside
// ========================================

document.addEventListener('click', (e) => {
  if (!e.target.closest('.book-container')) {
    document.querySelectorAll('.book input[type="radio"]').forEach(input => {
      input.checked = false;
    });
  }
});
