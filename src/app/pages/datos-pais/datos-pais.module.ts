import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPaisPageRoutingModule } from './datos-pais-routing.module';

import { DatosPaisPage } from './datos-pais.page';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPaisPageRoutingModule,
    TranslateModule
  ],
  declarations: [DatosPaisPage]
})
export class DatosPaisPageModule {}
