// Carrusel de testimonios con Embla Carousel. Tarjetas estilo reseña (sin conexión a APIs externas).
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { fill } from '../lib/utils.js';

function Stars({ count, label }) {
  return (
    <div className="flex gap-1" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={15}
          strokeWidth={1.2}
          aria-hidden="true"
          className={i < count ? 'fill-silver-100 text-silver-100' : 'text-silver-500'}
        />
      ))}
    </div>
  );
}

export default function TestimonialsCarousel({ items, labels }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false, slidesToScroll: 1 });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback((api) => {
    setSelected(api.selectedScrollSnap());
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onInit = (api) => {
      setSnaps(api.scrollSnapList());
      onSelect(api);
    };
    onInit(emblaApi);
    emblaApi.on('reInit', onInit).on('select', onSelect);
    return () => {
      emblaApi.off('reInit', onInit).off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const buttonClass =
    'grid size-12 place-items-center border border-white/25 text-white transition-colors duration-500 hover:border-white hover:bg-white hover:text-ink-950 disabled:pointer-events-none disabled:opacity-30';

  return (
    <div role="region" aria-roledescription="carousel" aria-label={labels.region}>
      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="-ml-5 flex touch-pan-y">
          {items.map((item, index) => (
            <li
              key={item.nombre}
              className="min-w-0 shrink-0 grow-0 basis-full pl-5 md:basis-1/2 lg:basis-1/3"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${items.length}`}
            >
              <article className="flex h-full flex-col border border-white/10 bg-white/[0.03] p-8 sm:p-10">
                <div className="flex items-center gap-4">
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-b from-silver-100 to-silver-400 font-serif text-lg text-ink-950"
                    aria-hidden="true"
                  >
                    {item.nombre.charAt(0)}
                  </span>
                  <div>
                    <p className="text-white">{item.nombre}</p>
                    <p className="text-sm text-silver-400">{item.fecha}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Stars count={item.estrellas} label={fill(labels.estrellas, { n: item.estrellas })} />
                </div>
                <Quote size={26} strokeWidth={1} className="mt-8 text-silver-500" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-[1.05rem] leading-relaxed text-silver-200">
                  <p>{item.comentario}</p>
                </blockquote>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex items-center justify-between gap-6">
        <div className="flex gap-2">
          {snaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={fill(labels.irA, { n: index + 1 })}
              aria-current={index === selected ? 'true' : undefined}
              className="group grid h-8 place-items-center"
            >
              <span
                className={`block h-px transition-all duration-700 ${
                  index === selected ? 'w-10 bg-white' : 'w-5 bg-white/30 group-hover:bg-white/60'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button type="button" className={buttonClass} onClick={() => emblaApi?.scrollPrev()} disabled={!canPrev} aria-label={labels.anterior}>
            <ArrowLeft size={18} strokeWidth={1.3} aria-hidden="true" />
          </button>
          <button type="button" className={buttonClass} onClick={() => emblaApi?.scrollNext()} disabled={!canNext} aria-label={labels.siguiente}>
            <ArrowRight size={18} strokeWidth={1.3} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
