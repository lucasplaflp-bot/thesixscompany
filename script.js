// THE SIX'S COMPANY — SCROLL ANIMATIONS

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// Custom cursor
const cursor = document.createElement('div');
cursor.style.cssText = `
  position: fixed;
  width: 10px; height: 10px;
  background: #c49a52;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.08s, width 0.2s, height 0.2s, opacity 0.2s;
  mix-blend-mode: difference;
`;
const cursorOuter = document.createElement('div');
cursorOuter.style.cssText = `
  position: fixed;
  width: 36px; height: 36px;
  border: 1px solid rgba(196,154,82,0.4);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: transform 0.18s, left 0.18s, top 0.18s;
`;
document.body.appendChild(cursor);
document.body.appendChild(cursorOuter);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorOuter.style.left = e.clientX + 'px';
  cursorOuter.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '18px';
    cursor.style.height = '18px';
    cursorOuter.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorOuter.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// Intersection Observer for scroll reveals
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .beat-row').forEach(el => {
  revealObserver.observe(el);
});

// Staggered cards
const cardGroups = document.querySelectorAll('.servicios__grid');
cardGroups.forEach(group => {
  const cards = group.querySelectorAll('.servicio-card');
  const groupObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('in-view'), i * 150);
        });
        groupObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  groupObserver.observe(group);
});

// Parallax on hero
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
  }
});

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
