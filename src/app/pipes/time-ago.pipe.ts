/* ==========================================================================
   pipes/time-ago.pipe.ts — Pipe personalizado "timeAgo"
   --------------------------------------------------------------------------
   Generado con:  ng generate pipe pipes/time-ago
   Un pipe transforma un valor dentro de la plantilla:
       {{ noticia.fecha | timeAgo }}   →   "Hace 3 h"
   ========================================================================== */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo', standalone: false })
export class TimeAgoPipe implements PipeTransform {
  transform(iso: string): string {
    const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.round(hours / 24);
    if (days <= 7) return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
