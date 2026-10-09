/* ==========================================================================
   FavoritesComponent — Lista personalizada de favoritos (localStorage)
   combineLatest une el listado de noticias con los ids favoritos: si el
   usuario quita una estrella aquí mismo, la tarjeta desaparece al instante.
   ========================================================================== */
import { Component } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { News } from '../../models/news';
import { NewsService } from '../../services/news.service';
import { StorageService } from '../../services/storage.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  /** Respeta el orden de guardado: la última marcada aparece primero. */
  readonly favorites$: Observable<News[]>;

  constructor(private newsService: NewsService, private storage: StorageService, private toast: ToastService) {
    this.favorites$ = combineLatest([this.newsService.news$, this.storage.favorites$]).pipe(
      map(([news, ids]) => ids.slice().reverse()
        .map((id) => news.find((n) => n.id === id))
        .filter((n): n is News => !!n))
    );
  }

  clearAll(): void {
    if (!confirm('¿Seguro que deseas quitar todas las noticias de favoritos?')) return;
    this.storage.clearFavorites();
    this.toast.show('Se vació tu lista de favoritos');
  }
}
