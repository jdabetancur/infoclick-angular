/* ==========================================================================
   services/toast.service.ts — Notificaciones breves
   Cualquier componente llama a toast.show('texto') y el ToastComponent,
   suscrito a message$, lo muestra en la parte inferior de la pantalla.
   ========================================================================== */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messageSubject = new Subject<string>();
  readonly message$ = this.messageSubject.asObservable();

  show(message: string): void {
    this.messageSubject.next(message);
  }
}
