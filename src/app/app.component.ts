/* ==========================================================================
   AppComponent — Componente raíz (<app-root> en index.html)
   Su plantilla arma el esqueleto común: encabezado, zona de páginas
   (<router-outlet>), pie de página y notificaciones.
   ========================================================================== */
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'InfoClick';
}
