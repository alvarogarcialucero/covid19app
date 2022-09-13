import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Covid19Service } from '../../services/covid19.service';
import { FiltroPage } from '../filtro/filtro.page';
import { TranslateService } from '@ngx-translate/core';

declare let google: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  
  //Datos generales del covid
  summaryCountriesData:any = {};

  //Datos generales del covid
  summaryWorldData:any = {};

  //Fecha actual
  fechaActual:Date = new Date();

  //Loading
  loading:boolean = true;

  selectedLang: String;


  constructor( private _covid19Service:Covid19Service,
               private _router:Router,
               public modalController:ModalController,
               public translate: TranslateService) {
               
    this.getSummaryGlobalCovid();
    
  }



  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,

  }

 
  doRefresh(event) {
    this.loading = true;
    
    setTimeout(() => {
      this.getSummaryGlobalCovid();
      event.target.complete();
    }, 2000);
  }

  getSummaryGlobalCovid() {
    this._covid19Service.getSummaryGlobalCovid().subscribe( response => {      
      this.drawWorldMap(response);
      this.summaryCountriesData = response['Countries'];
      this.summaryWorldData = response['Global'];
      this.fechaActual = response['Date'];
      this.loading = false;
    })
  }

  async consultarPais() {
      const modal = await this.modalController.create({
        component: FiltroPage
      });

      modal.onDidDismiss().then( dataModal => {
        if (dataModal.data) {
          let navigationExtraParams: NavigationExtras =  {
            queryParams: {
              datosPais: JSON.stringify(dataModal.data.datosPais),
              datosRegion: JSON.stringify(dataModal.data.datosRegion),
              datosSubRegion: JSON.stringify(dataModal.data.datosSubRegion),
              datosFechas: JSON.stringify(dataModal.data.datosFechas)
            }
          };

          this._router.navigate(["/tabs/pais/datos-pais"], navigationExtraParams);
        }
      });

      return await modal.present();
  }

drawWorldMap(response){
  const arr = [];
  arr.push(['Country', 'Total Confirmed']);  
 for (const prop in response['Countries']) {
   let countryCode = response['Countries'][prop].CountryCode;
   let totalConfirmed = response['Countries'][prop].TotalConfirmed;
   arr.push([countryCode,totalConfirmed]);
 }
 google.charts.load('current', {
   'packages':['geochart'],
   // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
   'mapsApiKey': 'AIzaSyCyOqF5XhXXbYksrCVHzXySJgfcOhMmyUg' // apiKey Alvaro //https://developers.google.com/maps/documentation/javascript/get-api-key?authuser=1
 });
 google.charts.setOnLoadCallback(drawRegionsMap);  
 function drawRegionsMap() {
   var data = google.visualization.arrayToDataTable(
     arr
   );  
   var options = {};  
   var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));  
   chart.draw(data, options);
 }
}

useLanguage(language: string) {
  this.translate.use(language);
}

selectLang(language: string){

  this.useLanguage(language);

}

}