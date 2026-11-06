(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const initialize = () => {
    const header = document.querySelector('[data-header]');
    const toggle = document.querySelector('[data-nav-toggle]');
    const navigation = document.querySelector('[data-nav]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const setMenuOpen = (open) => {
      if (!toggle || !navigation) return;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navigation.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    };

    toggle?.addEventListener('click', () => {
      setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    navigation?.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !document.querySelector('[data-screenshot-viewer][open]')) {
        setMenuOpen(false);
        toggle?.focus();
      }
    });

    const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    document.querySelectorAll('[data-year]').forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });

    const viewer = document.querySelector('[data-screenshot-viewer]');
    if (viewer && typeof viewer.showModal === 'function') {
      const image = viewer.querySelector('[data-screenshot-image]');
      const caption = viewer.querySelector('[data-screenshot-caption]');
      const original = viewer.querySelector('[data-screenshot-original]');
      const close = viewer.querySelector('[data-screenshot-close]');
      let trigger = null;
      let backdropPressed = false;

      document.querySelectorAll('.hero-product a, .gallery-image').forEach((link) => {
        const thumbnail = link.querySelector('img');
        if (!thumbnail) return;
        link.setAttribute('aria-haspopup', 'dialog');
        link.addEventListener('click', (event) => {
          // Preserve modified clicks and the original link as a no-JavaScript fallback.
          if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          trigger = link;
          image.src = link.href;
          image.alt = thumbnail.alt;
          const figureCaption = link.closest('figure')?.querySelector('figcaption');
          caption.textContent = figureCaption
            ? Array.from(figureCaption.childNodes, (node) => node.textContent.trim()).filter(Boolean).join(' ')
            : thumbnail.alt;
          original.href = link.href;
          viewer.showModal();
          document.body.classList.add('screenshot-viewer-open');
          close.focus();
        });
      });

      viewer.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        if (event.shiftKey && document.activeElement === close) {
          event.preventDefault();
          original.focus();
        } else if (!event.shiftKey && document.activeElement === original) {
          event.preventDefault();
          close.focus();
        }
      });
      close.addEventListener('click', () => viewer.close());
      viewer.addEventListener('cancel', (event) => {
        event.preventDefault();
        viewer.close();
      });
      // Only close when both ends of the gesture are on the backdrop.
      viewer.addEventListener('pointerdown', (event) => {
        backdropPressed = event.target === viewer;
      });
      viewer.addEventListener('click', (event) => {
        if (backdropPressed && event.target === viewer) viewer.close();
        backdropPressed = false;
      });
      viewer.addEventListener('close', () => {
        document.body.classList.remove('screenshot-viewer-open');
        trigger?.focus({ preventScroll: true });
      });
    }

    const reveals = document.querySelectorAll('.reveal');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      reveals.forEach((node) => node.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

      reveals.forEach((node) => observer.observe(node));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
