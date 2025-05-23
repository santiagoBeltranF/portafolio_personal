import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
// ... otras importaciones

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Santiago Beltran - Inicio' },
  { path: 'inicio', redirectTo: '', pathMatch: 'full' },// Esta es la ruta para AboutComponent
  // ... tus otras rutas (skills, curriculum, etc.)
];