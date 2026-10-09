/* ==========================================================================
   services/storage.service.ts — Persistencia en el navegador
   --------------------------------------------------------------------------
   Generado con:  ng generate service services/storage
   Es el único lugar de la aplicación que toca localStorage y sessionStorage.
   Gracias a la inyección de dependencias de Angular (providedIn: 'root')
   existe una sola instancia compartida por todos los componentes.

     - localStorage   → favoritos, noticias creadas y eliminadas (persisten
                        aunque se cierre el navegador).
     - sessionStorage → mensajes del formulario de contacto (duran mientras
                        la pestaña esté abierta).
   ========================================================================== */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Claves usadas; el prefijo evita choques con otros proyectos en localhost. */
export const STORAGE_KEYS = {
  favorites: 'infoclick.favoritos',
  created: 'infoclick.noticiasCreadas',
  deleted: 'infoclick.noticiasEliminadas',
  messages: 'infoclick.mensajesContacto'
};

@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * BehaviorSubject guarda el valor actual y avisa a quien esté suscrito cada
   * vez que cambia. Así el contador del encabezado se actualiza solo cuando
   * se marca una estrella en cualquier parte de la aplicación.
   */
  private favoritesSubject = new BehaviorSubject<number[]>(this.read(localStorage, STORAGE_KEYS.favorites, []));
  readonly favorites$ = this.favoritesSubject.asObservable();

  /* ---------------------------- Utilidades ---------------------------- */

  /** Lee un valor JSON; si no existe o está corrupto retorna el valor por defecto. */
  read<T>(storage: Storage, key: string, fallback: T): T {
    try {
      const raw = storage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch (error) {
      console.warn('No se pudo leer', key, error);
      return fallback;
    }
  }

  /** Guarda cualquier valor serializado como texto JSON. */
  write<T>(storage: Storage, key: string, value: T): void {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('No se pudo guardar', key, error);
    }
  }

  /* ----------------------------- Favoritos ---------------------------- */

  get favorites(): number[] {
    return this.favoritesSubject.value;
  }

  isFavorite(id: number): boolean {
    return this.favorites.includes(id);
  }

  /** Agrega o quita una noticia. Retorna true si quedó como favorita. */
  toggleFavorite(id: number): boolean {
    const exists = this.isFavorite(id);
    this.setFavorites(exists ? this.favorites.filter((f) => f !== id) : [...this.favorites, id]);
    return !exists;
  }

  removeFavorite(id: number): void {
    this.setFavorites(this.favorites.filter((f) => f !== id));
  }

  clearFavorites(): void {
    this.setFavorites([]);
  }

  private setFavorites(ids: number[]): void {
    this.write(localStorage, STORAGE_KEYS.favorites, ids);
    this.favoritesSubject.next(ids); // notifica a todos los suscriptores
  }

  /* ------------------- Mensajes de contacto (sesión) ------------------ */

  saveMessage(message: object): void {
    const messages = this.read<object[]>(sessionStorage, STORAGE_KEYS.messages, []);
    this.write(sessionStorage, STORAGE_KEYS.messages, [...messages, message]);
  }
}
