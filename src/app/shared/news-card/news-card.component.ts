/* ==========================================================================
   NewsCardComponent — Tarjeta de noticia reutilizable
   --------------------------------------------------------------------------
   Es el mismo componente del mockup de Figma y se usa en Inicio, Listado,
   Relacionadas y Favoritos:   <app-news-card [news]="n"></app-news-card>

   - @Input() recibe la noticia desde el componente padre (property binding).
   - @Output() avisa al padre cuando cambia el favorito (event binding).
   - [ngClass] pinta la estrella dorada si la noticia es favorita
     (directiva de atributo, lectura 7).
   ========================================================================== */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { News, categoryName } from '../../models/news';
import { StorageService } from '../../services/storage.service';
import { ToastService } from '../../services/toast.service';
import { shareNews } from '../share';

@Component({
  selector: 'app-news-card',
  standalone: false,
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css'
})
export class NewsCardComponent {
  /** Noticia a mostrar; el signo ! indica que siempre la entrega el padre. */
  @Input() news!: News;

  /** Evento propio: emite true/false cuando el usuario cambia el favorito. */
  @Output() favoriteChange = new EventEmitter<boolean>();

  constructor(private storage: StorageService, private toast: ToastService) {}

  get isFavorite(): boolean {
    return this.storage.isFavorite(this.news.id);
  }

  get category(): string {
    return categoryName(this.news.categoria);
  }

  toggleFavorite(): void {
    const nowFav = this.storage.toggleFavorite(this.news.id);
    this.toast.show(nowFav ? 'Noticia guardada en favoritos' : 'Noticia eliminada de favoritos');
    this.favoriteChange.emit(nowFav);
  }

  share(): void {
    shareNews(this.news, this.toast);
  }
}
