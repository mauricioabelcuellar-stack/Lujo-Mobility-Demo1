// Utilidades compartidas: cn() de shadcn/ui y reemplazo de marcadores {clave} en textos de content.json.
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
