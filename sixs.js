// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// Custom cursor
const cursor = document.createElement('div');
cursor.style.cssText = 'position:fixed;width:10px;height:10px;background:#c49a52;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform 0.08s,width 0.2s,height 0.2s;mix-blend-mode:difference;';
const cursorOuter = document.createElement('div');
cursorOuter.style.cssText = 'position:fixed;width:36px;height:36px;border:1px solid rgba(196,154,82,0.4);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform 0.18s,left 0.18s,top 0.18s;';
document.body.appendChild(cursor);
document.body.appendChild(cursorOuter);
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
  cursorOuter.style.left = e.clientX + 'px'; cursorOuter.style.top = e.clientY + 'px';
});
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width='18px'; cursor.style.height='18px'; cursorOuter.style.transform='translate(-50%,-50%) scale(1.5)'; });
  el.addEventListener('mouseleave', () => { cursor.style.width='10px'; cursor.style.height='10px'; cursorOuter.style.transform='translate(-50%,-50%) scale(1)'; });
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in-view'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.scroll-reveal,.scroll-reveal-left,.scroll-reveal-right,.beat-row,.beats-sticker').forEach(el => revealObserver.observe(el));

const cardGroups = document.querySelectorAll('.servicios__grid');
cardGroups.forEach(group => {
  const cards = group.querySelectorAll('.servicio-card');
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { cards.forEach((card, i) => setTimeout(() => card.classList.add('in-view'), i * 150)); }
    });
  }, { threshold: 0.1 }).observe(group);
});


// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ---- MODAL CONTRATAR ----
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalForm = document.getElementById('modalForm');
const modalServicio = document.getElementById('modalServicio');

document.querySelectorAll('.contratar-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    modalServicio.textContent = btn.dataset.servicio || '';
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('mNombre').value.trim();
  const contacto = document.getElementById('mContacto').value.trim();
  const detalle = document.getElementById('mDetalle').value.trim();
  const servicio = modalServicio.textContent;

  const msg = `🎵 *PEDIDO - THE SIX'S COMPANY*\n\n*Servicio:* ${servicio}\n*Nombre:* ${nombre}\n*Contacto:* ${contacto}\n*Detalle:* ${detalle || 'Sin detalles adicionales'}`;
  const waNum = window._waNumber || '542494018508';
  const url = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;

  window.open(url, '_blank');
  closeModal();
  modalForm.reset();
});

// ---- BEAT PLAYER ----
let currentAudio = null;
let currentRow = null;

function fmtTime(s) {
  if (!isFinite(s)) return '—';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + String(sec).padStart(2, '0');
}

document.querySelectorAll('.beat-row').forEach(row => {
  const src = row.dataset.src;
  if (!src) return;

  const btn = row.querySelector('.beat-play-btn');
  const bar = row.querySelector('.beat-row__bar-fill');
  const progressWrap = row.querySelector('.beat-row__progress');
  const elCurrent = row.querySelector('.beat-current');
  const elDuration = row.querySelector('.beat-duration');

  const audio = new Audio(src);
  audio.preload = 'metadata';

  audio.addEventListener('loadedmetadata', () => {
    elDuration.textContent = fmtTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    bar.style.width = pct + '%';
    elCurrent.textContent = fmtTime(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    btn.textContent = '▶';
    row.classList.remove('playing');
    bar.style.width = '0%';
    elCurrent.textContent = '0:00';
    currentAudio = null;
    currentRow = null;
  });

  btn.addEventListener('click', () => {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentRow.querySelector('.beat-play-btn').textContent = '▶';
      currentRow.querySelector('.beat-row__bar-fill').style.width = '0%';
      currentRow.querySelector('.beat-current').textContent = '0:00';
      currentRow.classList.remove('playing');
    }
    if (audio.paused) {
      audio.play();
      btn.textContent = '■';
      row.classList.add('playing');
      currentAudio = audio;
      currentRow = row;
    } else {
      audio.pause();
      btn.textContent = '▶';
      row.classList.remove('playing');
      currentAudio = null;
      currentRow = null;
    }
  });

  // Click en la barra para seek
  progressWrap.addEventListener('click', (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const barEl = row.querySelector('.beat-row__bar');
    const barRect = barEl.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - barRect.left) / barRect.width));
    if (audio.duration) audio.currentTime = pct * audio.duration;
  });
});
