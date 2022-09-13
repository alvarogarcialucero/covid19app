import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'pais',
    loadChildren: () => import('./pages/pais/pais.module').then( m => m.PaisPageModule)
  },
  {
    path: 'datos-pais',
    loadChildren: () => import('./pages/datos-pais/datos-pais.module').then( m => m.DatosPaisPageModule)
  },
  {
    path: 'filtro',
    loadChildren: () => import('./pages/filtro/filtro.module').then( m => m.FiltroPageModule)
  },  {
    path: 'zonas',
    loadChildren: () => import('./pages/zonas/zonas.module').then( m => m.ZonasPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
