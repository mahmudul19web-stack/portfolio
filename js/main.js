/* Everything runs after the page is ready */
document.addEventListener('DOMContentLoaded', () => {

  /* ===== 1. FOOTER YEAR (auto updates) ===== */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ===== 2. THEME TOGGLE (remembers choice) ===== */
  const html = document.documentElement, themeBtn = document.getElementById('themeBtn');
  const setTheme = t => {
    html.setAttribute('data-bs-theme', t);
    themeBtn.innerHTML = t === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  let saved = null; try { saved = localStorage.getItem('theme'); } catch (e) {}
  setTheme(saved || 'dark');
  themeBtn.addEventListener('click', e => {
    const next = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    themeBtn.classList.add('spin'); setTimeout(() => themeBtn.classList.remove('spin'), 500);
    if (reduce) { setTheme(next); return; }
    const wipe = document.getElementById('wipe'), r = themeBtn.getBoundingClientRect();
    wipe.style.left = (r.left + r.width / 2) + 'px'; wipe.style.top = (r.top + r.height / 2) + 'px';
    wipe.style.background = next === 'dark' ? '#d4ff3f' : '#3654ff';
    wipe.classList.remove('run'); void wipe.offsetWidth; wipe.classList.add('run');
    setTimeout(() => setTheme(next), 260);
    setTimeout(() => wipe.classList.remove('run'), 1400);
  });

  /* ===== 3. CLOSE MOBILE MENU AFTER CLICKING A LINK ===== */
  const menu = document.getElementById('menu');
  menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
    if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }));

  /* ===== 4. SCROLL EFFECTS: navbar shadow, progress bar, back to top ===== */
  const nav = document.getElementById('nav'), bar = document.getElementById('progress'), toTop = document.getElementById('toTop');
  const onScroll = () => {
    const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 20);
    const pc = max > 0 ? y / max * 100 : 0; bar.style.width = pc + '%'; document.getElementById('depth').textContent = Math.round(pc);
    toTop.classList.toggle('show', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===== 5. CODE WINDOW TYPING EFFECT (hero) ===== */
  const codeText = `const rupom = {
  name: "Mahmudul Haq Rupom",
  certified: "NSDA Web Design Lv-3",
  skills: ["HTML", "CSS",
           "JavaScript", "Bootstrap"],
  available: true,
  phone: "01998-572019"
};`;
  const codeEl = document.getElementById('code'); let i = 0;
  /* Simple syntax colours: strings, keys and the word const */
  const hl = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/("[^"]*")/g, '<span class="s">$1</span>').replace(/\b(const)\b/g, '<span class="kw">$1</span>')
    .replace(/^(\s*)(\w+):/gm, '$1<span class="k">$2</span>:');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  (function type() {
    if (reduce) { codeEl.innerHTML = hl(codeText); return; }
    codeEl.innerHTML = hl(codeText.slice(0, ++i));
    if (i < codeText.length) setTimeout(type, 45);
  })();

  /* ===== 6. SKILL BARS + COUNTERS (start when visible) ===== */
  const animateCount = (el, target, suffix = '') => {
    let n = 0; const step = Math.max(1, Math.ceil(target / 60));
    const t = setInterval(() => { n = Math.min(target, n + step); el.textContent = n + suffix; if (n >= target) clearInterval(t); }, 25);
  };
  const io = new IntersectionObserver((entries, obs) => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el.classList.contains('skill')) {          // skill bar
      const fill = el.querySelector('.bar i'), lv = +fill.dataset.level;
      fill.style.width = lv + '%'; animateCount(el.querySelector('.pct'), lv, '%');
    } else animateCount(el, +el.dataset.target);   // counter
    obs.unobserve(el);
  }), { threshold: .4 });
  document.querySelectorAll('.skill, .count').forEach(el => io.observe(el));

  /* ===== 7. PROJECT FILTER ===== */
  const fBtns = document.querySelectorAll('.filters .btn'), projs = document.querySelectorAll('.proj');
  fBtns.forEach(b => b.addEventListener('click', () => {
    fBtns.forEach(x => x.classList.remove('active')); b.classList.add('active');
    projs.forEach(p => p.classList.toggle('hidden', b.dataset.filter !== 'all' && p.dataset.category !== b.dataset.filter));
  }));

  /* ===== 8. CONTACT FORM: validate, then open the email app ===== */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;
    const body = `Name: ${fName.value}\nEmail: ${fEmail.value}\n\n${fMsg.value}`;
    location.href = `mailto:mahmudulweb@gmail.com?subject=${encodeURIComponent('Message from ' + fName.value)}&body=${encodeURIComponent(body)}`;
    form.reset(); form.classList.remove('was-validated');
  });

  const fine = matchMedia('(pointer: fine)').matches;

  /* ===== 9. HERO NAME: split into letters (CSS makes them rise one by one) ===== */
  const hn = document.getElementById('heroName'); let k = 0;
  const fullName = hn.textContent; hn.textContent = '';
  fullName.split(' ').forEach(word => {
    const w = document.createElement('span'); w.className = 'w';
    [...word].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.style.transitionDelay = (k++ * 45) + 'ms'; s.textContent = c; w.appendChild(s); });
    hn.appendChild(w);
  });
  document.querySelectorAll('.hello, .lead-text, .hero .d-flex, .social, .hero-visual').forEach((el, i) => {
    el.classList.add('fx'); el.style.transitionDelay = (0.7 + i * 0.15) + 's';
  });

  /* ===== 10. MARQUEE: duplicate items so the loop never breaks ===== */
  const track = document.querySelector('.track'); track.innerHTML += track.innerHTML;

  /* ===== 11. CUSTOM CURSOR: dot follows fast, ring follows smoothly ===== */
  if (fine) {
    const dot = document.getElementById('cur'), ring = document.getElementById('curRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    (function loop() { rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
    document.querySelectorAll('a, button, input, textarea, .card-x').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('big'));
      el.addEventListener('mouseleave', () => ring.classList.remove('big'));
    });

    /* ===== 12. 3D TILT ON CARDS + MAGNETIC BUTTONS + PHOTO PARALLAX ===== */
    document.querySelectorAll('.card-x').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(700px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-6px)`;
      });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    });
    document.querySelectorAll('.btn-brand, .btn-outline-brand, .social a').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
    const heroEl = document.querySelector('.hero'), photo = document.querySelector('.img-wrap');
    heroEl.addEventListener('mousemove', e => photo.style.transform = `translate(${(e.clientX / innerWidth - 0.5) * 22}px,${(e.clientY / innerHeight - 0.5) * 22}px)`);
  }

  /* ===== 13. HERO BACKGROUND: gold particles joined by lines, reacts to the mouse ===== */
  const cv = document.getElementById('bg'), cx = cv.getContext('2d'); let W, H, pts = [], mouse = { x: -999, y: -999 };
  const resize = () => {
    W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
    pts = Array.from({ length: Math.min(70, Math.floor(W / 18)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 }));
  };
  resize(); addEventListener('resize', resize);
  cv.parentElement.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  const line = (a, b, al) => { cx.globalAlpha = al; cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); cx.globalAlpha = 1; };
  (function draw() {
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = cx.strokeStyle = getComputedStyle(html).getPropertyValue('--accent').trim();
    pts.forEach((p, i) => {
      if (!reduce) { p.x += p.vx; p.y += p.vy; }
      if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      cx.beginPath(); cx.arc(p.x, p.y, 1.6, 0, 7); cx.fill();
      for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y); if (d < 120) line(p, pts[j], (1 - d / 120) * 0.5); }
      if (Math.hypot(p.x - mouse.x, p.y - mouse.y) < 160) line(p, mouse, 0.6);
    });
    requestAnimationFrame(draw);
  })();

  /* ===== 14. SCROLL REVEAL: items rise into view one after another ===== */
  const rio = new IntersectionObserver((list, o) => list.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('in'); o.unobserve(el); if (el.classList.contains('title') && !reduce) scramble(el);
    if (!el.classList.contains('title')) setTimeout(() => { el.classList.remove('rv'); el.style.transitionDelay = ''; }, 1800);
  }), { threshold: 0.15 });
  document.querySelectorAll('.section .title, #about .col-lg-7 > *, .info-list li, .stat, .card-x, .skill, .filters, form').forEach(el => {
    el.classList.add('rv'); el.style.transitionDelay = ([...el.parentElement.children].indexOf(el) % 4 * 110) + 'ms'; rio.observe(el);
  });

  /* ===== 15a. TEXT SCRAMBLE: letters flicker like code, then settle (titles + menu links) ===== */
  const SYM = '01<>/{}[]#$%';
  const scramble = el => {
    const t = el.dataset.t || (el.dataset.t = el.textContent); let f = 0;
    const id = setInterval(() => {
      el.textContent = [...t].map((c, x) => c === ' ' || x < f / 2 ? c : SYM[Math.random() * SYM.length | 0]).join('');
      if (++f > t.length * 2) { el.textContent = t; clearInterval(id); }
    }, 30);
  };
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('mouseenter', () => !reduce && scramble(l)));

  /* ===== 15b. HUD: live clock ===== */
  const clock = document.getElementById('clock');
  const showTime = () => clock.textContent = new Date().toLocaleTimeString('en-GB');
  showTime(); setInterval(showTime, 1000);

  /* ===== 15. PRELOADER: number counts to 100, then the curtain slides up and the hero starts ===== */
  const pre = document.getElementById('preloader'), num = document.getElementById('preNum'); let done = false;
  const finish = () => { if (done) return; done = true; pre.classList.add('hide'); heroEl0().classList.add('go'); hn.classList.add('go'); };
  const heroEl0 = () => document.querySelector('.hero');
  let n = 0;
  const tick = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 7)); num.textContent = n;
    document.getElementById('preMsg').textContent = n < 30 ? 'loading html...' : n < 60 ? 'compiling css...' : n < 95 ? 'running javascript...' : 'ready';
    if (n === 100) { clearInterval(tick); setTimeout(finish, 350); }
  }, 45);
  setTimeout(finish, 5000); // safety: never block the page if something is slow
});
