// Carrusel "También puedes consultar" con Embla Carousel: muestra los demás servicios con enlace a su página.
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { icons } from '../lib/icons.js';

export default function ServiceCarousel({ items, labels }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback((api) => {
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
    return () => {
      emblaApi.off('reInit', onSelect).off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const buttonClass =
    'grid size-12 place-items-center border border-white/25 text-white transition-colors duration-500 hover:border-white hover:bg-white hover:text-ink-950 disabled:pointer-events-none disabled:opacity-30';

  return (
    <div role="region" aria-roledescription="carousel" aria-label={labels.region}>
      <div className="mb-10 flex justify-end gap-3">
        <button type="button" className={buttonClass} onClick={() => emblaApi?.scrollPrev()} disabled={!canPrev} aria-label={labels.anterior}>
          <ArrowLeft size={18} strokeWidth={1.3} aria-hidden="true" />
        </button>
        <button type="button" className={buttonClass} onClick={() => emblaApi?.scrollNext()} disabled={!canNext} aria-label={labels.siguiente}>
          <ArrowRight size={18} strokeWidth={1.3} aria-hidden="true" />
        </button>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="-ml-4 flex touch-pan-y lg:-ml-5">
          {items.map((item) => {
            const ServiceIcon = icons[item.icono];
            return (
              <li
                key={item.href}
                className="min-w-0 shrink-0 grow-0 basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3 lg:pl-5"
                role="group"
                aria-roledescription="slide"
              >
                <a href={item.href} className="service-tile group">
                  <img
                    src={item.image.src}
                    srcSet={item.image.srcSet}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                    width={item.image.width}
                    height={item.image.height}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="service-tile__image"
                  />
                  <div className="service-tile__shade" aria-hidden="true" />
                  <div className="flex items-start justify-between">
                    <span className="silver-text font-serif text-4xl leading-none" aria-hidden="true">
                      {item.numero}
                    </span>
                    <span className="grid size-12 place-items-center rounded-full border border-white/25 text-silver-100 backdrop-blur-sm">
                      <ServiceIcon size={20} strokeWidth={1.3} aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl leading-tight text-white">{item.nombre}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-silver-300">{item.descripcion}</p>
                    <span className="link-arrow mt-6 text-[0.7rem] text-white">
                      {labels.verServicio}
                      <ArrowRight size={14} strokeWidth={1.3} aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
