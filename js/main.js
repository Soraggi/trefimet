(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const form = document.getElementById('contato-form');
  const feedback = document.getElementById('form-feedback');
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const num = entry.target.querySelector('.stat-number');
        const target = parseInt(num.dataset.target, 10);
        animateCounter(num, target);
        statsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat').forEach((stat) => statsObserver.observe(stat));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    const data = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      mensagem: form.mensagem.value.trim(),
    };

    if (!data.nome || !data.email || !data.mensagem) {
      feedback.textContent = 'Preencha todos os campos.';
      feedback.classList.add('error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        feedback.textContent = result.message || 'Mensagem enviada com sucesso!';
        feedback.classList.add('success');
        form.reset();
      } else {
        throw new Error(result.error || 'Erro ao enviar.');
      }
    } catch {
      feedback.textContent = 'Servidor indisponível. Tente novamente ou use o e-mail direto.';
      feedback.classList.add('error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar mensagem';
    }
  });
})();
