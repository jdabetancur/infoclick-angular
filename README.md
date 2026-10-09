# InfoClick — Plataforma Web de Noticias (Angular)

Entrega final (Entrega 3) del módulo **Desarrollo de Front-end** — Politécnico Grancolombiano.
Autor: Jose David Betancur Carmona · Tutor: John Olarte Ramos.

**Aplicación desplegada:** https://jdabetancur.github.io/infoclick-angular/
**Prototipo anterior (Entrega 2, jQuery):** https://jdabetancur.github.io/infoclick/

InfoClick es un portal de noticias de una sola página (SPA) donde el usuario explora noticias por
categoría, lee el detalle, guarda favoritos, escribe a la redacción y administra las noticias
(crear y eliminar).

## Tecnologías

- **Angular 19** (TypeScript) con arquitectura de módulo (`NgModule`), como en la lectura 7.
- **Componentes** generados con Angular CLI (`ng generate component`).
- **Data binding**: interpolación `{{ }}`, property binding `[ ]`, event binding `( )` y two-way binding `[(ngModel)]`.
- **Directivas**: `*ngFor`, `*ngIf`, `[ngClass]`, `[ngStyle]`.
- **Servicios + inyección de dependencias**, **HttpClient** para leer el JSON local y **RxJS** (Observables).
- **Router** con `HashLocationStrategy` (compatible con GitHub Pages).
- **Pipes**: `date` (configuración regional es-CO) y un pipe propio `timeAgo`.
- **localStorage / sessionStorage** para favoritos, noticias creadas/eliminadas y mensajes de contacto.
- **CSS3** con variables, Grid, Flexbox y media queries; estilos encapsulados por componente.

## Funcionalidades

| Requisito | Ruta |
|---|---|
| Home: header, carrusel de bienvenida, destacadas, CTA, testimonios, footer | `#/` |
| Listado en cards con filtro por categoría, buscador y paginación | `#/noticias` |
| Detalle + favoritos + compartir + contacto + relacionadas | `#/noticias/:id` |
| Categorías con conteo | `#/categorias` |
| Favoritos persistentes (localStorage) | ☆ en cada card · ícono rojo del encabezado → `#/favoritos` |
| Formulario de contacto validado + confirmación | `#/contacto` |
| Mini-CRUD: crear y eliminar noticias | `#/administrar` |

## Estructura

```
src/
├── index.html                  # contiene <app-root>
├── styles.css                  # tokens de diseño y estilos compartidos
└── app/
    ├── app.module.ts           # declara componentes, importa FormsModule, HttpClient
    ├── app-routing.module.ts   # rutas de la SPA
    ├── app.component.*         # esqueleto: header + <router-outlet> + footer
    ├── models/news.ts          # interfaz News y catálogo de categorías
    ├── services/
    │   ├── news.service.ts     # lectura del JSON + mini-CRUD
    │   ├── storage.service.ts  # localStorage / sessionStorage
    │   └── toast.service.ts    # notificaciones
    ├── pipes/time-ago.pipe.ts
    ├── layout/                 # header, footer, toast
    ├── shared/news-card/       # tarjeta reutilizable (@Input / @Output)
    └── pages/                  # home, news-list, news-detail, categories,
                                # favorites, contact, admin, not-found
public/
├── data/noticias.json          # 16 noticias base
└── img/                        # ilustraciones SVG
```

## Ejecutar en local

```bash
npm install
npm start          # ng serve → http://localhost:4200
```

## Despliegue

El flujo `.github/workflows/deploy.yml` compila y publica automáticamente en GitHub Pages en cada
`push` a `main`. Solo hay que activar una vez **Settings → Pages → Source: GitHub Actions**.
