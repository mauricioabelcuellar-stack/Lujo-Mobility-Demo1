// Smooth scroll (Lenis) + animaciones de entrada y parallax (GSAP + ScrollTrigger).
// Se importa una sola vez desde Layout.astro. Respeta prefers-reduced-motion.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const root = document.documentElement;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initSmoothScroll() {
  const lenis = new Lenis({ duration: 1.15, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // Referencia global para pausar el scroll desde otros componentes (p. ej. el menú móvil).
  window.lenis = lenis;
}

function initHero() {
  const items = gsap.utils.toArray('[data-hero-item]');
  if (items.length) {
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 1.4, ease: 'power2.out', stagger: 0.12, delay: 0.15 }
    );
  }

  gsap.utils.toArray('[data-parallax]').forEach((layer) => {
    gsap.fromTo(
      layer,
      { yPercent: 0 },
      {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: layer.parentElement, start: 'top top', end: 'bottom top', scrub: true },
      }
    );
  });
}

function initReveals() {
  const reveal = (targets, trigger, stagger = 0) =>
    gsap.fromTo(
      targets,
      { autoAlpha: 0, y: 32 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        stagger,
        scrollTrigger: { trigger, start: 'top 86%', once: true },
      }
    );

  gsap.utils.toArray('[data-reveal]').forEach((el) => reveal(el, el));
  gsap.utils.toArray('[data-reveal-stagger]').forEach((group) => reveal(group.children, group, 0.12));
}

if (prefersReducedMotion) {
  root.classList.remove('motion-ok');
} else {
  gsap.registerPlugin(ScrollTrigger);
  initSmoothScroll();
  initHero();
  initReveals();
  root.dataset.motionReady = 'true';
}
