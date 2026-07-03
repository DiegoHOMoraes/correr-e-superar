/* =============================================
   CORRER E SUPERAR — Interações
   JavaScript vanilla (sem framework / sem dependências)
============================================= */
(function () {
  'use strict';

  /* ---- Menu mobile (abrir/fechar) ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute(
        'aria-label',
        isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
      );
    });

    // Fecha o menu ao clicar em um link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Fecha o menu com a tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---- Animação de entrada (fade-in ao rolar) ---- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReduced) {
    var animated = document.querySelectorAll('.value-card, .shirt-card, .gallery-item');

    animated.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animated.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Carrossel de fotos (autoplay com controles acessíveis) ---- */
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-dot'));
    var prevBtn = carousel.querySelector('.carousel-arrow--prev');
    var nextBtn = carousel.querySelector('.carousel-arrow--next');
    var toggleBtn = carousel.querySelector('.carousel-toggle');
    var iconPause = toggleBtn ? toggleBtn.querySelector('.icon-pause') : null;
    var iconPlay = toggleBtn ? toggleBtn.querySelector('.icon-play') : null;

    if (!track || slides.length === 0) { return; }

    var current = 0;
    var intervalId = null;
    var userPaused = prefersReduced;
    var AUTOPLAY_MS = 3000;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        var isActive = i === current;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', String(isActive));
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function play() {
      if (intervalId || userPaused) { return; }
      intervalId = window.setInterval(next, AUTOPLAY_MS);
    }

    function stop() {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    }

    function setToggleUI(paused) {
      if (!toggleBtn) { return; }
      toggleBtn.setAttribute('aria-pressed', String(paused));
      toggleBtn.setAttribute(
        'aria-label',
        paused ? 'Retomar apresentação automática' : 'Pausar apresentação automática'
      );
      if (iconPause) { iconPause.hidden = paused; }
      if (iconPlay) { iconPlay.hidden = !paused; }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () { next(); });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', function () { prev(); });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    if (toggleBtn) {
      setToggleUI(userPaused);
      toggleBtn.addEventListener('click', function () {
        userPaused = !userPaused;
        setToggleUI(userPaused);
        if (userPaused) { stop(); } else { play(); }
      });
    }

    // Pausa ao passar o mouse ou focar nos controles; retoma ao sair (se não pausado manualmente)
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', function () { if (!userPaused) { play(); } });
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', function () { if (!userPaused) { play(); } });

    // Navegação por teclado quando o carrossel está em foco
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); }
      if (e.key === 'ArrowLeft') { prev(); }
    });

    goTo(0);
    if (!userPaused) { play(); }
  });
})();
