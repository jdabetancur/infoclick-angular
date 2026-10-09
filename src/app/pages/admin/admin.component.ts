/* ==========================================================================
   AdminComponent — Gestión básica de noticias (mini-CRUD)
   --------------------------------------------------------------------------
   - CREAR: formulario validado que agrega una noticia nueva.
   - LEER:  tabla con todas las noticias vigentes y buscador.
   - ELIMINAR: botón por fila con confirmación.
   Los cambios se guardan en localStorage a través de NewsService, por lo que
   la nueva noticia aparece al instante en Inicio, Listado, Categorías, etc.
   ========================================================================== */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CATEGORIES, CategoryKey, News, categoryName } from '../../models/news';
import { NewsService } from '../../services/news.service';
import { ToastService } from '../../services/toast.service';

/** Modelo del formulario (los párrafos se escriben como un solo texto). */
interface AdminForm {
  titulo: string;
  categoria: CategoryKey | '';
  autor: string;
  resumen: string;
  contenido: string;
  lecturaMin: number | null;
  imagen: string;
  destacado: boolean;
}

type Field = 'titulo' | 'categoria' | 'autor' | 'resumen' | 'contenido' | 'lecturaMin' | 'imagen';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit, OnDestroy {
  readonly categories = CATEGORIES;
  readonly categoryName = categoryName;

  news: News[] = [];
  filter = '';
  submitted = false;
  touched: Partial<Record<Field, boolean>> = {};
  form: AdminForm = this.emptyForm();
  private sub?: Subscription;

  constructor(private newsService: NewsService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.newsService.news$.subscribe((list) => (this.news = list));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private emptyForm(): AdminForm {
    return { titulo: '', categoria: '', autor: 'Redacción InfoClick', resumen: '', contenido: '', lecturaMin: 3, imagen: '', destacado: false };
  }

  /* ---------------------------- Validación ---------------------------- */

  error(field: Field): string {
    const f = this.form;
    switch (field) {
      case 'titulo':
        if (!f.titulo.trim()) return 'El título es obligatorio.';
        if (f.titulo.trim().length < 10) return 'Escribe al menos 10 caracteres.';
        return '';
      case 'categoria':
        return f.categoria ? '' : 'Selecciona una categoría.';
      case 'autor':
        return f.autor.trim().length >= 3 ? '' : 'Indica el autor (mínimo 3 caracteres).';
      case 'resumen': {
        const n = f.resumen.trim().length;
        if (n < 20) return `El resumen debe tener mínimo 20 caracteres (llevas ${n}).`;
        if (n > 220) return `El resumen admite máximo 220 caracteres (llevas ${n}).`;
        return '';
      }
      case 'contenido':
        return f.contenido.trim().length >= 50 ? '' : 'El contenido debe tener mínimo 50 caracteres.';
      case 'lecturaMin':
        return f.lecturaMin && f.lecturaMin >= 1 && f.lecturaMin <= 60 ? '' : 'Ingresa un número entre 1 y 60.';
      case 'imagen':
        return !f.imagen.trim() || /^https?:\/\/\S+$/i.test(f.imagen.trim()) ? '' : 'La URL debe empezar por http:// o https://';
    }
  }

  show(field: Field): boolean {
    return this.submitted || !!this.touched[field];
  }

  get isValid(): boolean {
    return (['titulo', 'categoria', 'autor', 'resumen', 'contenido', 'lecturaMin', 'imagen'] as Field[])
      .every((f) => !this.error(f));
  }

  /** Imagen de vista previa: la URL escrita o la ilustración de la categoría. */
  get previewImage(): string {
    if (this.form.imagen.trim() && !this.error('imagen')) return this.form.imagen.trim();
    return this.form.categoria ? `img/categoria-${this.form.categoria}.svg` : '';
  }

  /* ------------------------------ CREAR ------------------------------- */

  create(ngForm: NgForm): void {
    this.submitted = true;
    if (!this.isValid) {
      this.toast.show('Revisa los campos marcados en rojo');
      return;
    }
    const f = this.form;
    const created = this.newsService.create({
      titulo: f.titulo.trim(),
      categoria: f.categoria as CategoryKey,
      autor: f.autor.trim(),
      resumen: f.resumen.trim(),
      // Cada párrafo se separa con una línea en blanco (o salto de línea)
      contenido: f.contenido.split(/\n+/).map((p) => p.trim()).filter(Boolean),
      lecturaMin: Number(f.lecturaMin),
      imagen: this.previewImage,
      destacado: f.destacado
    }, this.news.map((n) => n.id));

    // resetForm(valores) limpia el estado "tocado" y deja los valores por defecto
    this.form = this.emptyForm();
    ngForm.resetForm({ ...this.form });
    this.touched = {};
    this.submitted = false;
    this.toast.show(`Noticia #${created.id} publicada`);
  }

  /* ----------------------------- ELIMINAR ----------------------------- */

  remove(news: News): void {
    if (!confirm(`¿Eliminar la noticia "${news.titulo}"?`)) return;
    this.newsService.delete(news);
    this.toast.show('Noticia eliminada');
  }

  restore(): void {
    this.newsService.restoreOriginals();
    this.toast.show('Se restauraron las noticias originales');
  }

  get deletedCount(): number {
    return this.newsService.deletedCount;
  }

  get createdCount(): number {
    return this.news.filter((n) => n.creadaPorUsuario).length;
  }

  /* ------------------------------- LEER ------------------------------- */

  get filtered(): News[] {
    const t = this.filter.trim().toLowerCase();
    return t ? this.news.filter((n) => `${n.id} ${n.titulo} ${categoryName(n.categoria)}`.toLowerCase().includes(t)) : this.news;
  }

  view(news: News): void {
    this.router.navigate(['/noticias', news.id]);
  }

  trackById(_: number, n: News): number {
    return n.id;
  }
}
