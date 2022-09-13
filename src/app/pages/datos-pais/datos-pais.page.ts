import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Covid19Service } from 'src/app/services/covid19.service';
import { FiltroPage } from '../filtro/filtro.page';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { CovidFactoryService } from 'src/app/services/covid-factory.service';
declare let google: any;
@Component({
  selector: 'app-datos-pais',
  templateUrl: './datos-pais.page.html',
  styleUrls: ['./datos-pais.page.scss'],
})
export class DatosPaisPage implements OnInit{
  /* Variables de control para las graficas */
  dates = [];

  /* Diario */
  @ViewChild('barChartDiario') barChartDiario;
  barsDiario:Chart;
  chartDataNewConfirmed = [];
  chartDataNewDeaths = [];
  chartDataNewIntensiveCare = [];
  chartDataNewHospitalised = [];
  selectedChartDiario: String = 'newConfirmed';

  /* Evolucion */
  @ViewChild('barChartEvolucion') barChartEvolucion;
  barsEvolucion:Chart;
  chartDataConfirmed = [];
  chartDataDeaths = [];
  chartDataIntensiveCare = [];
  chartDataHospitalised = [];
  selectedChartEvolucion: String = 'coonfirmed';

  /* Variable que controla el loading de la pagina */
  loading:boolean;

  /* Variables para el muestreo de datos en la pagina y datos del filtro */
  summary:any = {};
  filterData:any = {};
  typeFilter:string;

  constructor( private _activatedRoute:ActivatedRoute,
               private _covidService:Covid19Service,
               private _covidFactory:CovidFactoryService,
               public modalController: ModalController ) { 
    
    this._activatedRoute.queryParams.subscribe(params => {
      this.initCharts();
      let isFavouriteView = sessionStorage.getItem('favouriteView');
      if(isFavouriteView){
        this.checkFavouriteView();
        return;
      }
    
      this.filterData = {};
      this.filterData.datosPais = JSON.parse(params.datosPais);
      this.filterData.datosRegion = params.datosRegion ? JSON.parse(params.datosRegion) : {};
      this.filterData.datosSubRegion = params.datosSubRegion ? JSON.parse(params.datosSubRegion) : {};
      //this.drawMap();
      if (params && params.datosFechas) {
        this.filterData.datosFechas = JSON.parse(params.datosFechas);

        if (this.filterData.datosFechas.desde) {
          this.filterData.datosFechas.desdeFormat = moment(this.filterData.datosFechas.desde).format('YYYY-MM-DD');  
        }

        if (this.filterData.datosFechas.hasta) {
          this.filterData.datosFechas.hastaFormat = moment(this.filterData.datosFechas.hasta).format('YYYY-MM-DD');  
        }
      }

      this.typeFilter = this._covidFactory.getTypeFilter(this.filterData);

      if (this.barsDiario) {
        this.barsDiario.destroy();
      }

      if (this.barsEvolucion) {
        this.barsEvolucion.destroy();
      }

      this._getDataCovid(this.filterData);
    })
  }

  ngOnInit() {
 

  }

  /* Funcion que inicializa los datos de las diferentes graficas */
  initCharts(){
    this.chartDataNewConfirmed = [];
    this.chartDataNewDeaths = [];
    this.chartDataNewIntensiveCare = [];
    this.chartDataNewHospitalised = [];

    this.chartDataConfirmed = [];
    this.chartDataDeaths = [];
    this.chartDataIntensiveCare = [];
    this.chartDataHospitalised = [];
  }

checkFavouriteView(){
   
  let misZonas = JSON.parse(localStorage.getItem('misZonas'));

    if(misZonas){
      let miZonaFavorita: any;
      misZonas.forEach(zona => {
        if (zona.esFavorita) {
          miZonaFavorita = zona;
        }
      });
      if (!miZonaFavorita) {
        return;
      }
 
    this.filterData = {};
    this.filterData.datosPais = miZonaFavorita.datosPais;
    this.filterData.datosRegion = miZonaFavorita.datosRegion ? miZonaFavorita.datosRegion: {};
    this.filterData.datosSubRegion = miZonaFavorita.datosSubRegion ? miZonaFavorita.datosSubRegion : {};
    this.filterData.datosFechas = {};
    this._getDataCovid(this.filterData)
    this.typeFilter = this._covidFactory.getTypeFilter(this.filterData);

    if (this.barsDiario) {
      this.barsDiario.destroy();
    }

    if (this.barsEvolucion) {
      this.barsEvolucion.destroy();
    }
    sessionStorage.removeItem('favouriteView');
  }else{
    return;
  }

}

  /* Funcion asincrona para abrir el modal del filtro */
  async openModal() {
    const modal = await this.modalController.create({
      component: FiltroPage,
      componentProps: { filterData: this.filterData}
    });

    modal.onDidDismiss().then( dataModal => {
        if(dataModal.data){   
          this.initCharts();
          this.barsDiario.destroy();
          this.barsEvolucion.destroy();
          this.filterData = dataModal.data;
          this.typeFilter = this._covidFactory.getTypeFilter(this.filterData);
          this._getDataCovid(this.filterData);
        }
    });
    return await modal.present();
  }

  /* Funcion privada parao obtener los datos en funcion del filtro y el muestreo de la grafica */
  private _getDataCovid(filterData:any) {
    this.loading = true;
    
    this._covidService.getDataCountry(filterData).subscribe( response => {
      this.dates = Object.keys(response.dates);
      this.summary = this._covidFactory.getSummaryData(filterData, response);

      for (const prop in response.dates) {
        const datosPaisChart:any = Object.values(response.dates[prop].countries)[0];
        let itemChart:any = this._covidFactory.getChartData(datosPaisChart, filterData);

        this.chartDataNewConfirmed.push(itemChart.today_new_confirmed);
        this.chartDataNewDeaths.push(itemChart.today_new_deaths);
        this.chartDataNewIntensiveCare.push(itemChart.today_new_intensive_care);
        this.chartDataNewHospitalised.push(itemChart.today_new_total_hospitalised_patients);

        this.chartDataConfirmed.push(itemChart.today_confirmed);
        this.chartDataDeaths.push(itemChart.today_deaths);
        this.chartDataIntensiveCare.push(itemChart.today_intensive_care);
        this.chartDataHospitalised.push(itemChart.today_total_hospitalised_patients);
      }
      this.loading = false;
      this.createBarChartDiario('Confirmados',this.chartDataNewConfirmed);
      this.createBarChartEvolucion('Confirmados',this.chartDataConfirmed);
      this.selectedChartDiario = '';
      this.selectedChartEvolucion = ''
    });
  }

  /* Funcion para mostrar una determinada grafica en funcion de lo seleccionado por el usuario */
  selectHandler(event, type){
    if (type === 'diario') {
      this.barsDiario.destroy();
      this.selectedChartDiario = event;
      switch(event){
        case 'newConfirmed':
          this.createBarChartDiario('Confirmados',this.chartDataNewConfirmed);
        break;
        case 'newDeaths':
          this.createBarChartDiario('Fallecidos',this.chartDataNewDeaths);
        break;
        case 'newIntensiveCare':
          this.createBarChartDiario('UCI',this.chartDataNewIntensiveCare);
        break;
        case 'newHospitalised':
          this.createBarChartDiario('Hospitalizados',this.chartDataNewHospitalised);
        break;
       default:
          this.createBarChartDiario('Confirmados',this.chartDataNewConfirmed);
        break;
       }
    } else {
      this.barsEvolucion.destroy();
      this.selectedChartEvolucion = event;
      switch(event){
        case 'confirmed':
          this.createBarChartEvolucion('Confirmados',this.chartDataConfirmed);
        break;
        case 'deaths':
          this.createBarChartEvolucion('Fallecidos',this.chartDataDeaths);
        break;
        case 'intensiveCare':
          this.createBarChartEvolucion('UCI',this.chartDataIntensiveCare);
        break;
        case 'hospitalised':
          this.createBarChartEvolucion('Hospitalizados',this.chartDataHospitalised);
        break;
       default:
          this.createBarChartEvolucion('Confirmados',this.chartDataConfirmed);
        break;
       }
    }
  }

  /* Funcion que crea el chart para ver los casos por dia */
  createBarChartDiario(label, data):Chart {
    this.barsDiario = this._covidFactory.createBarChart(label, data, this.dates, this.barChartDiario, 'bar');
  }

  /* Funcion que crea el chart para la evolucion total del covid */
  createBarChartEvolucion(label, data):Chart {
    this.barsEvolucion = this._covidFactory.createBarChart(label, data, this.dates, this.barChartEvolucion, 'line');
  }

  
/*
  drawMap(){

    google.charts.load('current', {
      'packages':['geochart'],
      // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
      'mapsApiKey': 'AIzaSyCyOqF5XhXXbYksrCVHzXySJgfcOhMmyUg' // apiKey Alvaro //https://developers.google.com/maps/documentation/javascript/get-api-key?authuser=1
    });
    google.charts.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() {

      var data = google.visualization.arrayToDataTable([
        ['State', 'Population', 'Area(km²)'],
        ['ES-MD', 10569100, 35752]
      ]);

      var geochart = new google.visualization.GeoChart(document.getElementById('regions_div_pais'));

      geochart.draw(data, {width: 1024, height: 640, region: "ES", resolution: "provinces"});
    }

  }
  */

}
