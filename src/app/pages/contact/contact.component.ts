/* ==========================================================================
   ContactComponent — Formulario de contacto con validaciones
   --------------------------------------------------------------------------
   Formulario "template-driven": cada campo se enlaza con [(ngModel)] a la
   propiedad form del componente (two-way binding).

   Reglas (iguales a la Entrega 2):
     - Nombre:  obligatorio, mínimo 3 caracteres, solo letras y espacios.
     - Correo:  obligatorio y con formato válido.
     - Asunto:  obligatorio (lista desplegable).
     - Mensaje: obligatorio, mínimo 20 caracteres.
   Los errores aparecen cuando el campo fue tocado (blur) o al intentar
   enviar. Al enviar correctamente se muestra una confirmación y el
   mensaje se guarda en sessionStorage (el sitio no tiene backend).
   ========================================================================== */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ToastService } from '../../services/toast.service';

type Field = 'nombre' | 'correo' | 'asunto' | 'mensaje';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  readonly MIN_MESSAGE = 20;

  readonly subjects = [
    { value: 'historia', label: 'Proponer una historia' },
    { value: 'correccion', label: 'Reportar una corrección' },
    { value: 'noticia', label: 'Comentario sobre una noticia' },
    { value: 'publicidad', label: 'Publicidad y alianzas' },
    { value: 'otro', label: 'Otro' }
  ];

  /** Modelo del formulario: enlazado campo a campo con [(ngModel)]. */
  form: Record<Field, string> = { nombre: '', correo: '', asunto: '', mensaje: '' };

  /** Campos que el usuario ya visitó (para no mostrar errores antes de tiempo). */
  touched: Partial<Record<Field, boolean>> = {};
  submitted = false;
  sentName = '';            // nombre mostrado en la confirmación
  messagePlaceholder = 'Cuéntanos los detalles de tu mensaje...';

  /** Texto de ayuda por defecto de cada campo. */
  readonly hints: Record<Field, string> = {
    nombre: 'Campo obligatorio.',
    correo: 'Te responderemos a este correo.',
    asunto: 'Selecciona el motivo de tu mensaje.',
    mensaje: `Mínimo ${this.MIN_MESSAGE} caracteres.`
  };

  constructor(private route: ActivatedRoute, private storage: StorageService, private toast: ToastService) {}

  /** Si se llega desde el detalle de una noticia se preselecciona el asunto. */
  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('asunto') === 'noticia') {
      this.form.asunto = 'noticia';
      const ref = params.get('ref');
      if (ref) this.messagePlaceholder = `Cuéntanos tu comentario sobre la noticia #${ref}...`;
    }
  }

  /** Retorna el texto del error de un campo, o '' si es válido. */
  error(field: Field): string {
    const v = this.form[field].trim();
    switch (field) {
      case 'nombre':
        if (!v) return 'El nombre es obligatorio.';
        if (v.length < 3) return 'Escribe al menos 3 caracteres.';
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(v)) return 'El nombre solo puede contener letras y espacios.';
        return '';
      case 'correo':
        if (!v) return 'El correo electrónico es obligatorio.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Ingresa un correo electrónico válido.';
        return '';
      case 'asunto':
        return v ? '' : 'Selecciona el motivo de tu mensaje.';
      case 'mensaje':
        if (!v) return 'El mensaje es obligatorio.';
        if (v.length < this.MIN_MESSAGE) return `Mínimo ${this.MIN_MESSAGE} caracteres (llevas ${v.length}).`;
        return '';
    }
  }

  /** ¿Se debe mostrar el estado (error/válido) de este campo? */
  show(field: Field): boolean {
    return this.submitted || !!this.touched[field];
  }

  get isValid(): boolean {
    return (Object.keys(this.form) as Field[]).every((f) => !this.error(f));
  }

  submit(ngForm: NgForm): void {
    this.submitted = true;
    if (!this.isValid) {
      this.toast.show('Revisa los campos marcados en rojo');
      // Lleva el foco al primer campo con error
      const first = (Object.keys(this.form) as Field[]).find((f) => this.error(f));
      if (first) document.getElementById(first)?.focus();
      return;
    }

    const data = { ...this.form, fecha: new Date().toISOString() };
    this.storage.saveMessage(data);
    this.sentName = data.nombre.trim().split(' ')[0];

    // Limpia el formulario y su estado
    this.form = { nombre: '', correo: '', asunto: '', mensaje: '' };
    ngForm.resetForm({ ...this.form });
    this.touched = {};
    this.submitted = false;
    setTimeout(() => (this.sentName = ''), 8000);
  }
}
