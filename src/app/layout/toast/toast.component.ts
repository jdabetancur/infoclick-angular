/* ToastComponent — muestra los mensajes enviados por ToastService durante 2,2 s. */
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnDestroy {
  message = '';
  visible = false;
  private timer?: ReturnType<typeof setTimeout>;
  private sub: Subscription;

  constructor(toast: ToastService) {
    this.sub = toast.message$.subscribe((text) => {
      this.message = text;
      this.visible = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => (this.visible = false), 2200);
    });
  }

  /** Se libera la suscripción cuando el componente se destruye. */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    clearTimeout(this.timer);
  }
}
