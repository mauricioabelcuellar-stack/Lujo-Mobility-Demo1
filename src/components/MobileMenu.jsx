// Menú móvil: panel lateral (Sheet/Radix) con acordeón de servicios y entrada escalonada con Framer Motion.
import { useState } from 'react';
import { LazyMotion, MotionConfig, domAnimation, m as motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion.jsx';
import { icons } from '../lib/icons.js';

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } },
};
// LazyMotion carga solo las funciones de animación necesarias y respeta prefers-reduced-motion.
function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

const ctaItem = {
  hidden: item.hidden,
  show: { ...item.show, transition: { ...item.show.transition, delay: 0.65 } },
};

export default function MobileMenu({ items, services, labels, cta, logo, currentPath }) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (value) => {
    setOpen(value);
    // Lenis intercepta la rueda del mouse; se pausa mientras el menú está abierto.
    if (value) window.lenis?.stop();
    else window.lenis?.start();
  };

  const linkClass = (href) =>
    `block py-5 font-serif text-2xl transition-colors ${
      currentPath === href ? 'text-white' : 'text-silver-300 hover:text-white'
    }`;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        className="grid size-11 place-items-center border border-white/25 text-white transition-colors hover:border-white/70"
        aria-label={labels.abrir}
      >
        <Menu size={20} strokeWidth={1.3} aria-hidden="true" />
      </SheetTrigger>

      <SheetContent aria-describedby="mobile-menu-description" data-lenis-prevent>
        <MotionProvider>
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <SheetTitle className="sr-only">{labels.titulo}</SheetTitle>
            <SheetDescription id="mobile-menu-description" className="sr-only">
              {labels.descripcion}
            </SheetDescription>
            <img src={logo.src} width={logo.width} height={logo.height} alt="" className="h-auto w-[112px]" />
            <SheetClose
              className="grid size-11 place-items-center border border-white/25 text-white transition-colors hover:border-white/70"
              aria-label={labels.cerrar}
            >
              <X size={20} strokeWidth={1.3} aria-hidden="true" />
            </SheetClose>
          </div>

          <nav aria-label={labels.nav} className="flex-1 overflow-y-auto px-6 pb-8">
            <motion.ul variants={list} initial="hidden" animate="show">
              {items.map((link) =>
                link.key === 'servicios' ? (
                  <motion.li key={link.key} variants={item}>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="servicios">
                        <AccordionTrigger className="font-serif text-2xl text-silver-300 hover:text-white data-[state=open]:text-white">
                          {link.label}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-1">
                            {services.map((service) => {
                              const ServiceIcon = icons[service.icono];
                              return (
                                <li key={service.href}>
                                  <a
                                    href={service.href}
                                    className="flex items-center gap-4 py-2.5 text-silver-300 transition-colors hover:text-white"
                                  >
                                    <ServiceIcon size={18} strokeWidth={1.3} aria-hidden="true" className="shrink-0" />
                                    <span className="text-[0.95rem]">{service.nombre}</span>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                          <a href={link.href} className="link-arrow mt-4 text-xs text-white">
                            {labels.verTodos}
                            <ArrowRight size={14} strokeWidth={1.3} aria-hidden="true" />
                          </a>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </motion.li>
                ) : (
                  <motion.li key={link.key} variants={item} className="border-b border-white/10">
                    <a
                      href={link.href}
                      className={linkClass(link.href)}
                      aria-current={currentPath === link.href ? 'page' : undefined}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                )
              )}
            </motion.ul>

            <motion.div variants={ctaItem} initial="hidden" animate="show">
              <a href={cta.href} className="btn btn-light mt-10 w-full">
                {cta.label}
                <ArrowRight size={18} strokeWidth={1.3} aria-hidden="true" />
              </a>
            </motion.div>
          </nav>
        </MotionProvider>
      </SheetContent>
    </Sheet>
  );
}
