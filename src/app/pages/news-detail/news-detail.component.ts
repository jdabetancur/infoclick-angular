/* ==========================================================================
   NewsDetailComponent — Vista de detalle (#/noticias/:id)
   - Lee el parámetro :id de la ruta con ActivatedRoute.
   - Muestra el artículo completo, botones de favorito, compartir y contacto.
   - "Te puede interesar": 3 noticias, primero de la misma categoría.
   ========================================================================== */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest, map } from 'rxjs';
import { News, categoryName } from '../../models/news';
import { NewsService } from '../../services/news.service';
import { StorageService } from '../../services/storage.service';
import { ToastService } from '../../services/toast.service';
import { shareNews } from '../../shared/share';

@Component({
  selector: 'app-news-detail',
  standalone: false,
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css'
})
export class NewsDetailComponent implements OnInit, OnDestroy {
  news?: News;
  related: News[] = [];
  loading = true;
  readonly categoryName = categoryName;
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private storage: StorageService,
    private toast: ToastService,
    private title: Title
  ) {}

  ngOnInit(): void {
    // combineLatest reacciona tanto al cambio de :id como a cambios en los datos
    const id$ = this.route.paramMap.pipe(map((p) => Number(p.get('id'))));
    this.sub = combineLatest([id$, this.newsService.news$]).subscribe({
      next: ([id, all]) => {
        this.news = all.find((n) => n.id === id);
        this.loading = false;
        if (!this.news) {
          this.title.setTitle('Noticia no encontrada · InfoClick');
          return;
        }
        this.title.setTitle(`${this.news.titulo} · InfoClick`);
        const others = all.filter((n) => n.id !== id);
        this.related = [
          ...others.filter((n) => n.categoria === this.news!.categoria),
          ...others.filter((n) => n.categoria !== this.news!.categoria)
        ].slice(0, 3);
      },
      error: () => (this.loading = false)
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.title.setTitle('InfoClick · Noticias que importan');
  }

  get isFavorite(): boolean {
    return !!this.news && this.storage.isFavorite(this.news.id);
  }

  /** Iniciales del autor para el avatar ("Laura Gómez" → "LG"). */
  get initials(): string {
    return (this.news?.autor ?? '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }

  toggleFavorite(): void {
    if (!this.news) return;
    const nowFav = this.storage.toggleFavorite(this.news.id);
    this.toast.show(nowFav ? 'Noticia guardada en favoritos' : 'Noticia eliminada de favoritos');
  }

  share(): void {
    if (this.news) shareNews(this.news, this.toast);
  }
}
