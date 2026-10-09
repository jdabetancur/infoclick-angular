/* ==========================================================================
   app-routing.module.ts — Rutas de la SPA
   --------------------------------------------------------------------------
   useHash: true genera direcciones como  .../infoclick-angular/#/noticias
   Así GitHub Pages siempre entrega index.html y no aparece el error 404 al
   recargar una página interna (GitHub Pages no sabe nada de las rutas de
   Angular; con el "#" el navegador nunca pide esas rutas al servidor).
   ========================================================================== */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewsListComponent } from './pages/news-list/news-list.component';
import { NewsDetailComponent } from './pages/news-detail/news-detail.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'InfoClick · Noticias que importan' },
  { path: 'noticias', component: NewsListComponent, title: 'Noticias · InfoClick' },
  { path: 'noticias/:id', component: NewsDetailComponent },
  { path: 'categorias', component: CategoriesComponent, title: 'Categorías · InfoClick' },
  { path: 'favoritos', component: FavoritesComponent, title: 'Mis favoritos · InfoClick' },
  { path: 'contacto', component: ContactComponent, title: 'Contacto · InfoClick' },
  { path: 'administrar', component: AdminComponent, title: 'Administrar noticias · InfoClick' },
  { path: '**', component: NotFoundComponent, title: 'Página no encontrada · InfoClick' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'top'   // cada página nueva empieza arriba
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
