import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaisPage } from './pais.page';

const routes: Routes = [
  {
    path: '',
    component: PaisPage,
  },
  {
    path: 'datos-pais',
    loadChildren: () => import('../datos-pais/datos-pais.module').then( m => m.DatosPaisPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaisPageRoutingModule {}
