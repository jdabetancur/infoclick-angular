/* ==========================================================================
   app.module.ts — Módulo raíz de la aplicación
   --------------------------------------------------------------------------
   Tal como se explica en la lectura 7, el NgModule declara los componentes
   que forman la aplicación (declarations), importa los módulos de Angular
   que se necesitan (imports) e indica el componente de arranque (bootstrap).
   Cada componente se creó con "ng generate component ..." y Angular CLI lo
   registró aquí automáticamente.
   ========================================================================== */
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ToastComponent } from './layout/toast/toast.component';
import { NewsCardComponent } from './shared/news-card/news-card.component';
import { HomeComponent } from './pages/home/home.component';
import { NewsListComponent } from './pages/news-list/news-list.component';
import { NewsDetailComponent } from './pages/news-detail/news-detail.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

// Fechas y números en español de Colombia para el pipe date
registerLocaleData(localeEsCo);

@NgModule({
  declarations: [
    AppComponent,
    // Estructura común
    HeaderComponent,
    FooterComponent,
    ToastComponent,
    // Componente reutilizable
    NewsCardComponent,
    // Páginas
    HomeComponent,
    NewsListComponent,
    NewsDetailComponent,
    CategoriesComponent,
    FavoritesComponent,
    ContactComponent,
    AdminComponent,
    NotFoundComponent,
    // Pipe personalizado
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule        // habilita [(ngModel)] y ngForm
  ],
  providers: [
    provideHttpClient(),                  // habilita HttpClient para leer el JSON
    { provide: LOCALE_ID, useValue: 'es-CO' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
