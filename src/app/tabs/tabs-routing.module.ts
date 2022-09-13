import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZonasPageModule } from '../pages/zonas/zonas.module';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'pais',
        loadChildren: () => import('../pages/pais/pais.module').then( m => m.PaisPageModule)
      },
      {
        path: 'favorito',
        loadChildren: () => import('../pages/datos-pais/datos-pais.module').then( m => m.DatosPaisPageModule)
      },
      {
        path: 'zonas',
        loadChildren: () => import('../pages/zonas/zonas.module').then( m => ZonasPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
