/* FooterComponent — Pie de página con datos de contacto y enlaces. */
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  /** Año actual mostrado con interpolación {{ year }}. */
  readonly year = new Date().getFullYear();
}
