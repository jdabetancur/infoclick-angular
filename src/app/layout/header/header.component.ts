/* ==========================================================================
   HeaderComponent — Encabezado con menú de navegación
   - routerLink / routerLinkActive marcan la página actual sin recargar
     (la aplicación es una SPA: una sola página que cambia de vista).
   - El contador rojo de favoritos se enlaza al Observable favorites$.
   - En móvil, el botón ☰ abre/cierra el menú con event binding (click).
   ========================================================================== */
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  /** Opciones del menú: se pintan con *ngFor en la plantilla. */
  readonly links = [
    { path: '/', label: 'Inicio', exact: true },
    { path: '/noticias', label: 'Noticias', exact: false },
    { path: '/categorias', label: 'Categorías', exact: false },
    { path: '/contacto', label: 'Contacto', exact: false },
    { path: '/administrar', label: 'Administrar', exact: false }
  ];

  /** Estado del menú móvil (property binding sobre la clase is-open). */
  menuOpen = false;

  /** Número de favoritos, derivado del arreglo guardado en localStorage. */
  readonly favCount$: Observable<number>;

  constructor(private storage: StorageService, router: Router) {
    this.favCount$ = this.storage.favorites$.pipe(map((ids) => ids.length));
    // Al cambiar de página se cierra el menú móvil
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => (this.menuOpen = false));
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
