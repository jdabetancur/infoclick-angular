/* ==========================================================================
   models/news.ts — Modelo de datos de la aplicación
   --------------------------------------------------------------------------
   Generado con:  ng generate interface models/news
   Una interfaz de TypeScript describe la "forma" que deben tener los objetos
   (lectura 7, sección Interfaces). Si una noticia no cumple esta forma, el
   compilador avisa del error antes de que la aplicación llegue al navegador.
   ========================================================================== */

/** Claves de categoría válidas (tal como vienen en data/noticias.json). */
export type CategoryKey = 'actualidad' | 'tecnologia' | 'economia' | 'deportes';

/** Una noticia del portal. */
export interface News {
  id: number;
  titulo: string;
  categoria: CategoryKey;
  resumen: string;
  contenido: string[];   // un elemento por párrafo
  autor: string;
  fecha: string;         // fecha ISO 8601, p. ej. "2026-09-25T08:00:00"
  lecturaMin: number;
  imagen: string;        // ruta relativa (img/...) o URL absoluta
  destacado: boolean;
  creadaPorUsuario?: boolean; // true si se creó desde la página Administrar
}

/** Datos de una categoría para chips, tarjetas y formularios. */
export interface Category {
  key: CategoryKey;
  name: string;
  description: string;
}

/** Catálogo de categorías disponible en toda la aplicación. */
export const CATEGORIES: Category[] = [
  { key: 'actualidad', name: 'Actualidad', description: 'Lo que pasa hoy en el país y las ciudades.' },
  { key: 'tecnologia', name: 'Tecnología', description: 'Innovación, ciencia y mundo digital.' },
  { key: 'economia',   name: 'Economía',   description: 'Mercados, empresas y finanzas personales.' },
  { key: 'deportes',   name: 'Deportes',   description: 'Resultados, figuras y competencias.' }
];

/** Nombre legible de una categoría ("tecnologia" → "Tecnología"). */
export function categoryName(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.name ?? key;
}

/** Datos que el usuario escribe en el formulario de creación (mini-CRUD). */
export type NewsDraft = Omit<News, 'id' | 'fecha' | 'creadaPorUsuario'>;
