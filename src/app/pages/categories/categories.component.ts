/* ==========================================================================
   CategoriesComponent — Una tarjeta por categoría con el conteo de noticias.
   Al hacer clic abre el listado ya filtrado: #/noticias?cat=deportes
   ========================================================================== */
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CATEGORIES, Category } from '../../models/news';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  /** Observable con cada categoría + su total; se consume con el pipe async. */
  readonly categories$: Observable<(Category & { total: number })[]>;

  constructor(private newsService: NewsService) {
    this.categories$ = this.newsService.news$.pipe(
      map((news) => CATEGORIES.map((cat) => ({
        ...cat,
        total: news.filter((n) => n.categoria === cat.key).length
      })))
    );
  }
}
