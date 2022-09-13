import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZonasPageRoutingModule } from './zonas-routing.module';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';

import { ZonasPage } from './zonas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZonasPageRoutingModule,
    TranslateModule
  ],
  declarations: [ZonasPage]
})
export class ZonasPageModule {}
