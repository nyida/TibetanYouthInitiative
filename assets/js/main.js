document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  const isHome = !currentPage || currentPage === 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) {
      return;
    }

    const linkPage = href.split('/').pop();
    const isHomeLink = linkPage === 'index.html' || href.endsWith('/');

    if ((isHome && isHomeLink) || linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Open menu');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Open menu');
        mobileMenuToggle.focus();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      if (navMenu) {
        navMenu.classList.remove('open');
      }
      if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Open menu');
      }
    });
  });
});

function sortTable(tableId, columnIndex) {
  const table = document.getElementById(tableId);
  if (!table) {
    return;
  }

  const rows = Array.from(table.querySelectorAll('tbody tr'));

  rows.sort((a, b) => {
    const aValue = a.cells[columnIndex].textContent.trim();
    const bValue = b.cells[columnIndex].textContent.trim();

    const aNum = parseFloat(aValue.replace(/,/g, ''));
    const bNum = parseFloat(bValue.replace(/,/g, ''));

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }

    return aValue.localeCompare(bValue);
  });

  const tbody = table.querySelector('tbody');
  rows.forEach(row => tbody.appendChild(row));
}
