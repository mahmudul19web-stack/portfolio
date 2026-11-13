
/* ==========================================
   MAHMUDUL HAQ RUPOM - PORTFOLIO JAVASCRIPT
   EmailJS Contact Form + Website Animations
========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. EMAILJS CONFIGURATION
  ========================================== */

  const EMAILJS_PUBLIC_KEY = 'KJtUaZKK-a-xsD0Bg';
  const EMAILJS_SERVICE_ID = 'mahmudul19';
  const EMAILJS_TEMPLATE_ID = 'template_x8eoc5t';

  // Initialize EmailJS
  if (window.emailjs) {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY
    });
  } else {
    console.error('EmailJS SDK was not loaded.');
  }


  /* ==========================================
     2. FOOTER YEAR
  ========================================== */

  const yearElement = document.getElementById('year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* ==========================================
     3. THEME TOGGLE
  ========================================== */

  const html = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const wipe = document.getElementById('wipe');

  const reduce = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const setTheme = (theme) => {

    html.setAttribute('data-bs-theme', theme);

    if (themeBtn) {
      themeBtn.innerHTML =
        theme === 'dark'
          ? '<i class="bi bi-sun"></i>'
          : '<i class="bi bi-moon-stars"></i>';
    }

    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Theme preference could not be saved.');
    }

  };

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem('theme');
  } catch (error) {
    console.warn('Theme preference could not be loaded.');
  }

  setTheme(savedTheme || 'dark');

  if (themeBtn) {

    themeBtn.addEventListener('click', () => {

      const nextTheme =
        html.getAttribute('data-bs-theme') === 'dark'
          ? 'light'
          : 'dark';

      themeBtn.classList.add('spin');

      setTimeout(() => {
        themeBtn.classList.remove('spin');
      }, 500);

      if (reduce || !wipe) {
        setTheme(nextTheme);
        return;
      }

      const rect = themeBtn.getBoundingClientRect();

      wipe.style.left =
        (rect.left + rect.width / 2) + 'px';

      wipe.style.top =
        (rect.top + rect.height / 2) + 'px';

      wipe.style.background =
        nextTheme === 'dark' ? '#d4ff3f' : '#3654ff';

      wipe.classList.remove('run');

      void wipe.offsetWidth;

      wipe.classList.add('run');

      setTimeout(() => setTheme(nextTheme), 260);

      setTimeout(() => {
        wipe.classList.remove('run');
      }, 1400);

    });

  }


  /* ==========================================
     4. MOBILE NAVBAR CLOSE
  ========================================== */

  const menu = document.getElementById('menu');

  if (menu && window.bootstrap) {

    menu.querySelectorAll('.nav-link').forEach(link => {

      link.addEventListener('click', () => {

        if (menu.classList.contains('show')) {

          bootstrap.Collapse
            .getOrCreateInstance(menu)
            .hide();

        }

      });

    });

  }


  /* ==========================================
     5. SCROLL EFFECTS
  ========================================== */

  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress');
  const toTop = document.getElementById('toTop');
  const depth = document.getElementById('depth');

  const onScroll = () => {

    const scrollY = window.scrollY;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (nav) {
      nav.classList.toggle('scrolled', scrollY > 20);
    }

    const percentage =
      maxScroll > 0
        ? (scrollY / maxScroll) * 100
        : 0;

    if (progress) {
      progress.style.width = percentage + '%';
    }

    if (depth) {
      depth.textContent = Math.round(percentage);
    }

    if (toTop) {
      toTop.classList.toggle('show', scrollY > 500);
    }

  };

  window.addEventListener('scroll', onScroll, {
    passive: true
  });

  onScroll();

  if (toTop) {

    toTop.addEventListener('click', () => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    });

  }


  /* ==========================================
     6. HERO CODE TYPING EFFECT
  ========================================== */

  const codeText = `const rupom = {
  name: "Mahmudul Haq Rupom",
  certified: "NSDA Web Design Lv-3",
  skills: ["HTML", "CSS",
           "JavaScript", "Bootstrap"],
  available: true,
  phone: "01998-572019"
};`;

  const codeElement = document.getElementById('code');

  const highlightCode = (source) => {

    return source
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("[^"]*")/g, '<span class="s">$1</span>')
      .replace(/\b(const)\b/g, '<span class="kw">$1</span>')
      .replace(/^(\s*)(\w+):/gm, '$1<span class="k">$2</span>:');

  };

  if (codeElement) {

    if (reduce) {

      codeElement.innerHTML = highlightCode(codeText);

    } else {

      let index = 0;

      const typeCode = () => {

        index++;

        codeElement.innerHTML =
          highlightCode(codeText.slice(0, index));

        if (index < codeText.length) {
          setTimeout(typeCode, 45);
        }

      };

      typeCode();

    }

  }


  /* ==========================================
     7. SKILL BARS AND COUNTERS
  ========================================== */

  const animateCount = (element, target, suffix = '') => {

    let number = 0;

    const step = Math.max(1, Math.ceil(target / 60));

    const timer = setInterval(() => {

      number = Math.min(target, number + step);

      element.textContent = number + suffix;

      if (number >= target) {
        clearInterval(timer);
      }

    }, 25);

  };

  if ('IntersectionObserver' in window) {

    const skillObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          const element = entry.target;

          if (element.classList.contains('skill')) {

            const fill = element.querySelector('.bar i');
            const percentage = element.querySelector('.pct');

            if (fill && percentage) {

              const level = Number(fill.dataset.level) || 0;

              fill.style.width = level + '%';

              animateCount(percentage, level, '%');

            }

          } else {

            const target =
              Number(element.dataset.target) || 0;

            animateCount(element, target);

          }

          observer.unobserve(element);

        });

      },
      { threshold: 0.4 }
    );

    document.querySelectorAll('.skill, .count').forEach(element => {
      skillObserver.observe(element);
    });

  }


  /* ==========================================
     8. PROJECT FILTER
  ========================================== */

  const filterButtons =
    document.querySelectorAll('.filters .btn');

  const projects =
    document.querySelectorAll('.proj');

  filterButtons.forEach(button => {

    button.addEventListener('click', () => {

      filterButtons.forEach(item => {
        item.classList.remove('active');
      });

      button.classList.add('active');

      const selectedFilter = button.dataset.filter;

      projects.forEach(project => {

        const shouldHide =
          selectedFilter !== 'all' &&
          project.dataset.category !== selectedFilter;

        project.classList.toggle('hidden', shouldHide);

      });

    });

  });


  /* ==========================================
     9. EMAILJS CONTACT FORM
  ========================================== */

  const contactForm =
    document.getElementById('contactForm');

  const formStatus =
    document.getElementById('form-status');

  const sendButton =
    document.getElementById('sendBtn');

  const sendButtonText =
    document.getElementById('sendBtnText');

  const timeField =
    document.getElementById('form-time');


  // Form status message
  const showFormStatus = (message, type) => {

    if (!formStatus) return;

    formStatus.textContent = message;

    formStatus.className = '';

    formStatus.classList.add(type);

  };


  if (contactForm) {

    contactForm.addEventListener('submit', async (event) => {

      event.preventDefault();

      // Validate form
      contactForm.classList.add('was-validated');

      if (!contactForm.checkValidity()) {

        showFormStatus(
          'Please fill in all fields correctly.',
          'text-danger'
        );

        return;

      }


      // Check EmailJS SDK
      if (!window.emailjs) {

        showFormStatus(
          'Email service is not loaded. Please refresh the page.',
          'text-danger'
        );

        return;

      }


      // Prevent duplicate submissions
      if (sendButton) {
        sendButton.disabled = true;
      }

      if (sendButtonText) {
        sendButtonText.textContent = 'Sending...';
      }

      showFormStatus(
        'Sending your message. Please wait...',
        'text-info'
      );


      // Generate Bangladesh local time
      if (timeField) {

        timeField.value = new Date().toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
          dateStyle: 'medium',
          timeStyle: 'medium'
        });

      }


      try {

        // Send email using EmailJS
        const response = await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          contactForm
        );

        console.log('EmailJS Success:', response);

        // Show success message
        showFormStatus(
          'Your message has been sent successfully!',
          'text-success'
        );

        // Reset form
        contactForm.reset();

        contactForm.classList.remove('was-validated');


      } catch (error) {

        // Display detailed error in console
        console.error('EmailJS Error:', error);

        // Show error message
        showFormStatus(
          error?.text
            ? 'EmailJS Error: ' + error.text
            : 'Message could not be sent. Please try again.',
          'text-danger'
        );

      } finally {

        // Enable send button again
        if (sendButton) {
          sendButton.disabled = false;
        }

        if (sendButtonText) {
          sendButtonText.textContent = 'Send message';
        }

      }

    });

  }


  /* ==========================================
     10. CUSTOM CURSOR
  ========================================== */

  const finePointer = window.matchMedia(
    '(pointer: fine)'
  ).matches;

  if (finePointer) {

    const dot = document.getElementById('cur');
    const ring = document.getElementById('curRing');

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;

    if (dot && ring) {

      window.addEventListener('mousemove', event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        dot.style.transform =
          `translate(${mouseX}px, ${mouseY}px)`;

      });

      const cursorLoop = () => {

        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.transform =
          `translate(${ringX}px, ${ringY}px)`;

        requestAnimationFrame(cursorLoop);

      };

      cursorLoop();

      document.querySelectorAll(
        'a, button, input, textarea, .card-x'
      ).forEach(element => {

        element.addEventListener('mouseenter', () => {
          ring.classList.add('big');
        });

        element.addEventListener('mouseleave', () => {
          ring.classList.remove('big');
        });

      });

    }


    // 3D card tilt
    document.querySelectorAll('.card-x').forEach(card => {

      card.addEventListener('mousemove', event => {

        const rect = card.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform =
          `perspective(700px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-6px)`;

      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });

    });


    // Magnetic buttons
    document.querySelectorAll(
      '.btn-brand, .btn-outline-brand, .social a'
    ).forEach(button => {

      button.addEventListener('mousemove', event => {

        const rect = button.getBoundingClientRect();

        const x =
          (event.clientX - rect.left - rect.width / 2) * 0.25;

        const y =
          (event.clientY - rect.top - rect.height / 2) * 0.35;

        button.style.transform =
          `translate(${x}px, ${y}px)`;

      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });

    });


    // Profile image parallax
    const hero = document.querySelector('.hero');
    const photo = document.querySelector('.img-wrap');

    if (hero && photo) {

      hero.addEventListener('mousemove', event => {

        photo.style.transform =
          `translate(${(event.clientX / window.innerWidth - 0.5) * 22}px, ${(event.clientY / window.innerHeight - 0.5) * 22}px)`;

      });

    }

  }


  /* ==========================================
     11. HERO BACKGROUND PARTICLES
  ========================================== */

  const canvas = document.getElementById('bg');

  if (canvas) {

    const context = canvas.getContext('2d');

    let width = 0;
    let height = 0;

    let points = [];

    const mouse = {
      x: -999,
      y: -999
    };


    const resizeCanvas = () => {

      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;

      points = Array.from(
        {
          length: Math.min(70, Math.floor(width / 18))
        },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4
        })
      );

    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    canvas.parentElement.addEventListener('mousemove', event => {

      const rect = canvas.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;

    });


    const drawLine = (a, b, alpha) => {

      context.globalAlpha = alpha;

      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();

      context.globalAlpha = 1;

    };


    const drawParticles = () => {

      context.clearRect(0, 0, width, height);

      context.fillStyle =
        context.strokeStyle =
        getComputedStyle(html)
          .getPropertyValue('--accent').trim();

      points.forEach((point, index) => {

        if (!reduce) {

          point.x += point.vx;
          point.y += point.vy;

        }

        if (point.x < 0 || point.x > width) {
          point.vx *= -1;
        }

        if (point.y < 0 || point.y > height) {
          point.vy *= -1;
        }

        context.beginPath();
        context.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
        context.fill();


        for (let j = index + 1; j < points.length; j++) {

          const distance = Math.hypot(
            point.x - points[j].x,
            point.y - points[j].y
          );

          if (distance < 120) {

            drawLine(
              point,
              points[j],
              (1 - distance / 120) * 0.5
            );

          }

        }


        const mouseDistance = Math.hypot(
          point.x - mouse.x,
          point.y - mouse.y
        );

        if (mouseDistance < 160) {
          drawLine(point, mouse, 0.6);
        }

      });

      requestAnimationFrame(drawParticles);

    };

    drawParticles();

  }


  /* ==========================================
     12. HERO NAME LETTER ANIMATION
  ========================================== */

  const heroName = document.getElementById('heroName');

  if (heroName) {

    const fullName = heroName.textContent.trim();

    heroName.textContent = '';

    let characterIndex = 0;

    fullName.split(' ').forEach(word => {

      const wordElement = document.createElement('span');

      wordElement.className = 'w';

      [...word].forEach(character => {

        const span = document.createElement('span');

        span.className = 'ch';

        span.style.transitionDelay =
          (characterIndex++ * 45) + 'ms';

        span.textContent = character;

        wordElement.appendChild(span);

      });

      heroName.appendChild(wordElement);

    });


    if (!reduce) {

      document.querySelectorAll(
        '.hello, .lead-text, .hero .d-flex, .social, .hero-visual'
      ).forEach((element, index) => {

        element.classList.add('fx');

        element.style.transitionDelay =
          (0.7 + index * 0.15) + 's';

      });

    }

  }


  /* ==========================================
     13. MARQUEE DUPLICATION
  ========================================== */

  const track = document.querySelector('.track');

  if (track) {
    track.innerHTML += track.innerHTML;
  }


  /* ==========================================
     14. SCROLL REVEAL ANIMATION
  ========================================== */

  if ('IntersectionObserver' in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          const element = entry.target;

          element.classList.add('in');

          observer.unobserve(element);

          if (
            element.classList.contains('title') &&
            !reduce
          ) {
            scrambleText(element);
          }

          if (!element.classList.contains('title')) {

            setTimeout(() => {

              element.classList.remove('rv');

              element.style.transitionDelay = '';

            }, 1800);

          }

        });

      },
      { threshold: 0.15 }
    );


    document.querySelectorAll(
      '.section .title, #about .col-lg-7 > *, .info-list li, .stat, .card-x, .skill, .filters, form'
    ).forEach(element => {

      element.classList.add('rv');

      const siblings =
        [...element.parentElement.children];

      element.style.transitionDelay =
        (siblings.indexOf(element) % 4 * 110) + 'ms';

      revealObserver.observe(element);

    });

  }


  /* ==========================================
     15. TEXT SCRAMBLE EFFECT
  ========================================== */

  const symbols = '01<>/{}[]#$%';

  function scrambleText(element) {

    const originalText =
      element.dataset.t ||
      (element.dataset.t = element.textContent);

    let frame = 0;

    const timer = setInterval(() => {

      element.textContent = [...originalText]
        .map((character, index) => {

          if (character === ' ' || index < frame / 2) {
            return character;
          }

          return symbols[
            Math.floor(Math.random() * symbols.length)
          ];

        })
        .join('');

      frame++;

      if (frame > originalText.length * 2) {

        element.textContent = originalText;

        clearInterval(timer);

      }

    }, 30);

  }


  document.querySelectorAll('.nav-link').forEach(link => {

    link.addEventListener('mouseenter', () => {

      if (!reduce) {
        scrambleText(link);
      }

    });

  });


  /* ==========================================
     16. LIVE CLOCK
  ========================================== */

  const clock = document.getElementById('clock');

  if (clock) {

    const updateClock = () => {

      clock.textContent =
        new Date().toLocaleTimeString('en-GB');

    };

    updateClock();

    setInterval(updateClock, 1000);

  }


  /* ==========================================
     17. PRELOADER
  ========================================== */

  const preloader =
    document.getElementById('preloader');

  const preloaderNumber =
    document.getElementById('preNum');

  const preloaderMessage =
    document.getElementById('preMsg');

  let finished = false;


  const finishPreloader = () => {

    if (finished) return;

    finished = true;

    if (preloader) {
      preloader.classList.add('hide');
    }

    const hero = document.querySelector('.hero');

    if (hero) {
      hero.classList.add('go');
    }

    if (heroName) {
      heroName.classList.add('go');
    }

  };


  if (preloader && preloaderNumber) {

    let number = 0;

    const preloaderTimer = setInterval(() => {

      number = Math.min(
        100,
        number + Math.ceil(Math.random() * 7)
      );

      preloaderNumber.textContent = number;

      if (preloaderMessage) {

        preloaderMessage.textContent =
          number < 30
            ? 'loading html...'
            : number < 60
              ? 'compiling css...'
              : number < 95
                ? 'running javascript...'
                : 'ready';

      }

      if (number === 100) {

        clearInterval(preloaderTimer);

        setTimeout(finishPreloader, 350);

      }

    }, 45);


    // Safety timeout
    setTimeout(finishPreloader, 5000);

  } else {

    finishPreloader();

  }

});
