import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaisPageRoutingModule } from './pais-routing.module';

import { PaisPage } from './pais.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaisPageRoutingModule,
    PipesModule,
    TranslateModule
  ],
  declarations: [PaisPage]
})
export class PaisPageModule {}
