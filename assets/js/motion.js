(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    if (prefersReducedMotion) {
      return;
    }

    const selectors = [
      'main > section',
      '.page-primary > section',
      '.page-sidebar',
      '.publication-item',
      '.award-item',
      '.service-category',
      '.program-block',
      '.gallery-item',
      '.article-header',
      '.article-body > section',
      '.article-figure',
      'footer'
    ];

    const candidates = Array.from(document.querySelectorAll(selectors.join(', ')));
    if (!candidates.length) {
      return;
    }

    candidates.forEach((el, index) => {
      el.classList.add('reveal');
      const delay = Math.min((index % 5) + 1, 5);
      el.classList.add(`reveal-delay-${delay}`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
      }
    );

    candidates.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        requestAnimationFrame(() => {
          el.classList.add('is-visible');
        });
      } else {
        observer.observe(el);
      }
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') {
          return;
        }
        const target = document.querySelector(href);
        if (!target) {
          return;
        }
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });
})();
