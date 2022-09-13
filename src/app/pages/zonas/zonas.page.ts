import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.page.html',
  styleUrls: ['./zonas.page.scss'],
})
export class ZonasPage {
  misZonas:any[] = [];

  constructor( private _router:Router) {}

  ionViewWillEnter() {
    this.misZonas = localStorage.getItem('misZonas') ? JSON.parse(localStorage.getItem('misZonas')) : [];

    this.misZonas.forEach( zona => {
      zona.esPais = false;
      zona.esRegion = false;
      zona.esSubRegion = false;

      if (zona.datosSubRegion && zona.datosSubRegion.id) {
        zona.esSubRegion = true;
      } else if (zona.datosRegion && zona.datosRegion.id) {
        zona.esRegion = true;
      } else {
        zona.esPais = true;
      }
    });
  }

  cambiarZonaFavorita(zonaCambiada:any) {
    const zonaAuax = {
      ...zonaCambiada
    };

    this.misZonas.forEach(zona => zona.esFavorita = false);

    if (!zonaAuax.esFavorita) {
      zonaCambiada.esFavorita = !zonaCambiada.esFavorita;
    }

    this._guardarZonas();

    var event = new CustomEvent('click-estrella', { 'detail': zonaCambiada, 'bubbles': true, 'composed': true});
    // Disparar event.
    window.dispatchEvent(event);
  }

  verZona(zona:any) {
    let navigationExtraParams: NavigationExtras =  {
      queryParams: {
        datosPais: JSON.stringify(zona.datosPais),
        datosRegion: JSON.stringify(zona.datosRegion),
        datosSubRegion: JSON.stringify(zona.datosSubRegion),
        datosFechas: JSON.stringify({})
      }
    };

    this._router.navigate(["/tabs/pais/datos-pais"], navigationExtraParams);
  }

  borrarZona(index:number) {
    const zona = this.misZonas[index];

    this.misZonas.splice(index,1);
    this._guardarZonas();

    if (zona.esFavorita) {
      zona.esFavorita = false;
      var event = new CustomEvent('click-estrella', { 'detail': zona, 'bubbles': true, 'composed': true});
      // Disparar event.
      window.dispatchEvent(event);
    }
  }

  private _guardarZonas() {
    localStorage.setItem('misZonas', JSON.stringify(this.misZonas));
  }

  ionViewWillLeave() {
    this._guardarZonas();
  }
}
