/* ==========================================================================
   HomeComponent — Página de inicio
   - Carrusel con las noticias marcadas como "destacado" (máximo 3).
   - Tarjetas con las 3 noticias más recientes.
   - Secciones informativas, testimonios y llamado a la acción (CTA).
   ngOnInit / ngOnDestroy son "hooks" del ciclo de vida del componente.
   ========================================================================== */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { News, categoryName } from '../../models/news';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  highlights: News[] = [];  // diapositivas del carrusel
  latest: News[] = [];      // tarjetas "Noticias destacadas"
  current = 0;              // índice de la diapositiva visible
  loading = true;
  error = false;

  /** Contenido estático declarado como datos y pintado con *ngFor. */
  readonly reasons = [
    { icon: '✔', title: 'Información verificada', text: 'Cada publicación pasa por un proceso de contraste de fuentes antes de llegar a ti.' },
    { icon: '★', title: 'Guarda lo que te interesa', text: 'Marca noticias como favoritas y encuéntralas después, incluso si cierras el navegador.' },
    { icon: '✉', title: 'Participa', text: '¿Tienes una historia o encontraste un error? Escríbele directamente a la redacción.' }
  ];
  readonly testimonials = [
    { quote: 'Me gusta que los resúmenes van directo al punto. Leo lo importante en cinco minutos.', author: 'Lectora de Medellín' },
    { quote: 'La sección de favoritos me sirve para guardar las noticias de economía y leerlas con calma.', author: 'Lector de Bogotá' },
    { quote: 'Envié una corrección por el formulario y la actualizaron el mismo día.', author: 'Lectora de Cali' }
  ];

  readonly categoryName = categoryName;
  private readonly SLIDE_INTERVAL = 6000;
  private timer?: ReturnType<typeof setInterval>;
  private sub?: Subscription;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.sub = this.newsService.news$.subscribe({
      next: (news) => {
        const featured = news.filter((n) => n.destacado).slice(0, 3);
        // Si el usuario eliminó todas las destacadas se usan las más recientes
        this.highlights = featured.length ? featured : news.slice(0, 3);
        this.latest = news.slice(0, 3);
        this.current = Math.min(this.current, Math.max(0, this.highlights.length - 1));
        this.loading = false;
        this.startAutoplay();
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.stopAutoplay();
  }

  goTo(index: number): void {
    this.current = index;
    this.startAutoplay(); // reinicia el temporizador al elegir manualmente
  }

  startAutoplay(): void {
    this.stopAutoplay();
    if (this.highlights.length > 1) {
      this.timer = setInterval(() => (this.current = (this.current + 1) % this.highlights.length), this.SLIDE_INTERVAL);
    }
  }

  stopAutoplay(): void {
    clearInterval(this.timer);
  }
}
