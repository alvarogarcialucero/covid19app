import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PaisPage } from '../pais/pais.page';
import * as moment from 'moment';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.page.html',
  styleUrls: ['./filtro.page.scss'],
})
export class FiltroPage {

  datosFiltro:any = {
    datosPais: {},
    datosRegion: {},
    datosSubRegion: {},
    datosFechas: {},
    enables: {}
  };

  guardarFavorita: Boolean = false;

  
  sinceDate:String = moment().subtract(1,'M').format('YYYY-MM-DD');
  fromDate: String = moment().format('YYYY-MM-DD');

  guardarBusqueda:boolean = false;

  constructor( public modalController:ModalController,
               public navParams:NavParams ) {
    if (navParams.get('filterData')) {
      const filterData = navParams.get('filterData');
      this.datosFiltro.datosPais = (filterData.datosPais && filterData.datosPais.id) ? filterData.datosPais : {};
      this.datosFiltro.datosRegion = (filterData.datosRegion && filterData.datosRegion.id) ? filterData.datosRegion : {};
      this.datosFiltro.datosSubRegion = (filterData.datosSubRegion && filterData.datosSubRegion.id) ? filterData.datosSubRegion : {};
      this.datosFiltro.datosFechas = filterData.datosFechas ? filterData.datosFechas : {};

      this.datosFiltro.enables = {};
      this.datosFiltro.enables.enabledRegion = (filterData.datosPais && filterData.datosPais.id) ? true : false;
      this.datosFiltro.enables.enabledSubRegion = (filterData.datosRegion && filterData.datosRegion.id) ? true : false;
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  filtrar() {
    //console.log(this.defaultZone);
    if (this.datosFiltro && this.datosFiltro.datosFechas && this.datosFiltro.datosFechas.desde) {
      this.datosFiltro.datosFechas.desdeFormat = moment(this.datosFiltro.datosFechas.desde).format('YYYY-MM-DD');
    }

    if (this.datosFiltro && this.datosFiltro.datosFechas && this.datosFiltro.datosFechas.hasta) {
      this.datosFiltro.datosFechas.hastaFormat = moment(this.datosFiltro.datosFechas.hasta).format('YYYY-MM-DD');
    }

    if (this.guardarFavorita) {
      this._guardarZonaBusqueda(true);
    } else if (this.guardarBusqueda) {
      this._guardarZonaBusqueda(false);
    }
    
    this.modalController.dismiss(this.datosFiltro);
  }

 

  async seleccionPais() {
    this.datosFiltro.datosRegion = {};
    this.datosFiltro.datosSubRegion = {};

    const modal = await this.modalController.create({
      component: PaisPage
    });

    modal.onDidDismiss().then( dataModal => {
      if (dataModal.data) {
        this.datosFiltro.datosPais = dataModal.data;
        this.datosFiltro.enables.enabledRegion = true;
        this.datosFiltro.enables.enabledSubRegion = false;
      }
    });

    return await modal.present();
  }

  
  async seleccionRegion() {
    this.datosFiltro.datosSubRegion = {};
    const modal = await this.modalController.create({
      component: PaisPage,
      componentProps: { typeSearch: 'region', country:this.datosFiltro.datosPais.id}
    });

    modal.onDidDismiss().then( dataModal => {
      if (dataModal.data) {
        this.datosFiltro.datosRegion = dataModal.data;
        this.datosFiltro.enables.enabledSubRegion = true;
      }
    });

    return await modal.present();
  }

  async seleccionSubRegion() {
    const modal = await this.modalController.create({
      component: PaisPage,
      componentProps: { typeSearch: 'subregion', country: this.datosFiltro.datosPais.id, region: this.datosFiltro.datosRegion.id}
    });

    modal.onDidDismiss().then( dataModal => {
      if (dataModal.data) {
        this.datosFiltro.datosSubRegion = dataModal.data;
        this.datosFiltro.enables.enabledSubRegion = true;
      }
    });

    return await modal.present();
  }

  private _guardarZonaBusqueda(esFavorita:boolean) {
    let misZonas = [];
    const miZona:any = {
      ...this.datosFiltro
    };

    delete miZona.datosFechas;
    delete miZona.enables;
    miZona.esFavorita = esFavorita;

    if (localStorage.getItem('misZonas')) {
      misZonas = JSON.parse(localStorage.getItem('misZonas'));
    }

    if (esFavorita) {
      var event = new CustomEvent('click-estrella', { 'detail': miZona, 'bubbles': true, 'composed': true});
      // Disparar event.
      window.dispatchEvent(event);
      miZona.esPais = false;
      miZona.esRegion = false;
      miZona.esSubRegion = false;

      if (miZona.datosSubRegion && miZona.datosSubRegion.id) {
        miZona.esSubRegion = true;
      } else if (miZona.datosRegion && miZona.datosRegion.id) {
        miZona.esRegion = true;
      } else {
        miZona.esPais = true;
      }
      misZonas.forEach(zona => zona.esFavorita = false);
    }
  
    misZonas.push(miZona);
    localStorage.setItem('misZonas', JSON.stringify(misZonas));
  }
}
