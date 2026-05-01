// CONSTRUYENDO LAZOS — Scroll Animations & Interactions

// Nav: scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Nav: burger menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Scroll reveal with IntersectionObserver
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings inside same parent
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach(sib => {
        if (sib === entry.target) {
          setTimeout(() => sib.classList.add('in-view'), delay);
        }
      });
      // fallback: just reveal immediately with a small delay
      setTimeout(() => entry.target.classList.add('in-view'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Stagger cards in grids
document.querySelectorAll('.services__grid, .process__steps, .trust__grid').forEach(group => {
  const items = group.querySelectorAll('.reveal');
  const groupObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('in-view'), i * 100);
        });
        groupObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  groupObserver.observe(group);
});

// Hero parallax on shapes
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const shapes = document.querySelectorAll('.hero__shape');
  shapes.forEach((s, i) => {
    const speed = (i + 1) * 0.08;
    s.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Contact form: basic feedback
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✓ Consulta enviada';
    btn.style.background = '#059669';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Enviar consulta';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
}
