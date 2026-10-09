/* Función compartida para el botón "Compartir" (tarjeta y detalle). */
import { News } from '../models/news';
import { ToastService } from '../services/toast.service';

/** Usa la API nativa de compartir si existe; si no, copia el enlace al portapapeles. */
export function shareNews(news: News, toast: ToastService): void {
  // Con HashLocationStrategy las rutas viven después de "#", p. ej. .../#/noticias/3
  const url = `${location.origin}${location.pathname}#/noticias/${news.id}`;
  if (navigator.share) {
    navigator.share({ title: news.titulo, url }).catch(() => { /* el usuario canceló */ });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
      .then(() => toast.show('Enlace copiado al portapapeles'))
      .catch(() => toast.show(url));
  } else {
    toast.show(url);
  }
}
