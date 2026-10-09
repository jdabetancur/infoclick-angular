/* ==========================================================================
   NewsListComponent — Listado de noticias
   - Filtro por categoría (chips) y buscador de texto con [(ngModel)]
     (two-way binding: lo que se escribe actualiza la propiedad y viceversa).
   - Paginación de 6 tarjetas por página.
   - La categoría se refleja en la URL (#/noticias?cat=deportes) para que
     el enlace filtrado se pueda compartir.
   Los filtros son "getters": Angular los recalcula al detectar cambios, por
   eso no hace falta ocultar/mostrar tarjetas a mano como en jQuery.
   ========================================================================== */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CATEGORIES, News } from '../../models/news';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-list',
  standalone: false,
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit, OnDestroy {
  readonly PAGE_SIZE = 6;
  readonly chips = [{ key: 'todas', name: 'Todas' }, ...CATEGORIES.map((c) => ({ key: c.key, name: c.name }))];

  all: News[] = [];
  category = 'todas';
  search = '';
  page = 1;
  loading = true;
  error = false;

  private subs = new Subscription();

  constructor(private newsService: NewsService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Lee ?cat= de la URL (por ejemplo, al llegar desde la página Categorías)
    this.subs.add(this.route.queryParamMap.subscribe((params) => {
      const cat = params.get('cat') ?? 'todas';
      this.category = this.chips.some((c) => c.key === cat) ? cat : 'todas';
      this.page = 1;
    }));

    this.subs.add(this.newsService.news$.subscribe({
      next: (news) => { this.all = news; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Noticias que cumplen la categoría y el texto buscado. */
  get filtered(): News[] {
    const text = this.search.trim().toLowerCase();
    return this.all.filter((n) =>
      (this.category === 'todas' || n.categoria === this.category) &&
      (!text || `${n.titulo} ${n.resumen} ${n.autor}`.toLowerCase().includes(text))
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.PAGE_SIZE));
  }

  /** Arreglo [1, 2, ..., n] para pintar los botones con *ngFor. */
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pageItems(): News[] {
    const start = (this.page - 1) * this.PAGE_SIZE;
    return this.filtered.slice(start, start + this.PAGE_SIZE);
  }

  get rangeText(): string {
    const total = this.filtered.length;
    if (!total) return '';
    const start = (this.page - 1) * this.PAGE_SIZE;
    return `Mostrando ${start + 1}–${Math.min(start + this.PAGE_SIZE, total)} de ${total} noticias`;
  }

  selectCategory(key: string): void {
    // Actualiza la URL sin agregar una entrada nueva al historial
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { cat: key === 'todas' ? null : key },
      replaceUrl: true
    });
  }

  onSearch(): void {
    this.page = 1;
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    document.getElementById('listado')?.scrollIntoView({ behavior: 'smooth' });
  }

  /** trackBy evita que Angular vuelva a crear tarjetas que no cambiaron. */
  trackById(_: number, news: News): number {
    return news.id;
  }
}
