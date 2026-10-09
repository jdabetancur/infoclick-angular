/* ==========================================================================
   services/news.service.ts — Datos de noticias y mini-CRUD
   --------------------------------------------------------------------------
   Generado con:  ng generate service services/news

   Fuente de datos = JSON local (public/data/noticias.json) + cambios del
   usuario guardados en localStorage:
     - noticias creadas  → se agregan al listado.
     - ids eliminados    → se ocultan del listado.
   El archivo JSON nunca se modifica (en un sitio estático no se puede
   escribir en el servidor), por eso los cambios viven en el navegador.

   Los componentes no reciben arreglos sino "Observables" (RxJS): flujos de
   datos a los que se suscriben con el pipe async. Cuando se crea o elimina
   una noticia, todos los listados abiertos se actualizan automáticamente.
   ========================================================================== */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay } from 'rxjs';
import { News, NewsDraft } from '../models/news';
import { STORAGE_KEYS, StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class NewsService {
  /** Ruta relativa: funciona igual en localhost y en GitHub Pages (subcarpeta). */
  private readonly JSON_URL = 'data/noticias.json';

  /**
   * Petición HTTP GET al JSON. shareReplay(1) hace que se descargue una sola
   * vez aunque varios componentes la pidan (equivale al caché de la Entrega 2).
   */
  private readonly base$: Observable<News[]>;

  /** Estado local del mini-CRUD: noticias creadas e ids eliminados. */
  private created$: BehaviorSubject<News[]>;
  private deleted$: BehaviorSubject<number[]>;

  /** Lista final que ven los componentes, de la más reciente a la más antigua. */
  readonly news$: Observable<News[]>;

  /** El constructor recibe sus dependencias por inyección (HttpClient y StorageService). */
  constructor(private http: HttpClient, private storage: StorageService) {
    this.created$ = new BehaviorSubject<News[]>(this.storage.read(localStorage, STORAGE_KEYS.created, []));
    this.deleted$ = new BehaviorSubject<number[]>(this.storage.read(localStorage, STORAGE_KEYS.deleted, []));
    this.base$ = this.http.get<News[]>(this.JSON_URL).pipe(shareReplay(1));

    this.news$ = combineLatest([this.base$, this.created$, this.deleted$]).pipe(
      map(([base, created, deleted]) =>
        [...base, ...created]
          .filter((n) => !deleted.includes(n.id))
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      ),
      shareReplay(1)
    );
  }

  /** Busca una noticia por id (emite undefined si no existe o fue eliminada). */
  getById(id: number): Observable<News | undefined> {
    return this.news$.pipe(map((list) => list.find((n) => n.id === id)));
  }

  /* ----------------------------- Mini-CRUD ---------------------------- */

  /**
   * CREATE: agrega una noticia nueva. El id se calcula como el mayor id
   * existente + 1, considerando también las noticias base, para no repetir.
   */
  create(draft: NewsDraft, currentIds: number[]): News {
    const nextId = Math.max(0, ...currentIds, ...this.created$.value.map((n) => n.id), ...this.deleted$.value) + 1;
    const news: News = {
      ...draft,
      id: nextId,
      fecha: new Date().toISOString(),
      creadaPorUsuario: true
    };
    const created = [...this.created$.value, news];
    this.storage.write(localStorage, STORAGE_KEYS.created, created);
    this.created$.next(created);
    return news;
  }

  /**
   * DELETE: si la noticia la creó el usuario se borra de verdad; si viene
   * del JSON se guarda su id en la lista de eliminadas para ocultarla.
   * También se quita de favoritos para no dejar referencias huérfanas.
   */
  delete(news: News): void {
    if (news.creadaPorUsuario) {
      const created = this.created$.value.filter((n) => n.id !== news.id);
      this.storage.write(localStorage, STORAGE_KEYS.created, created);
      this.created$.next(created);
    } else {
      const deleted = [...this.deleted$.value, news.id];
      this.storage.write(localStorage, STORAGE_KEYS.deleted, deleted);
      this.deleted$.next(deleted);
    }
    this.storage.removeFavorite(news.id);
  }

  /** Vuelve a mostrar las noticias originales del JSON que se habían eliminado. */
  restoreOriginals(): void {
    this.storage.write(localStorage, STORAGE_KEYS.deleted, []);
    this.deleted$.next([]);
  }

  get deletedCount(): number {
    return this.deleted$.value.length;
  }
}
