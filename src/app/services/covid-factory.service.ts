import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class CovidFactoryService {

  constructor() { }

  /* Factory que devuelve los datos a mostrar dependiendo del filtro */
  getSummaryData(filterData:any, response:any) {
    let item:any = {};
    let datosPais:any = Object.values(response.dates[filterData.datosFechas.hastaFormat].countries)[0];
    const typeFilter:string = this.getTypeFilter(filterData);

    switch (typeFilter) {
      case 'subregion':
        const datosRegion:any = _.find((datosPais.regions), item => item.id === filterData.datosRegion.id);
        item = _.find((datosRegion.sub_regions), item => item.id === filterData.datosSubRegion.id);
        break;
      case 'region':
        item = _.find((datosPais.regions), item => item.id === filterData.datosRegion.id);
        break;
      case 'pais':
        item = datosPais;
        break;
    };

    return item;
  }

  /* Factory que devuelve los datos para la grafica */
  getChartData(datosPaisChart:any, filterData:any) {
    const typeFilter:string = this.getTypeFilter(filterData);
    let itemChart:any = {};

    switch (typeFilter) {
      case 'subregion':
        const datosRegionFecha:any = _.find((datosPaisChart.regions), item => item.id === filterData.datosRegion.id);
        itemChart = _.find((datosRegionFecha.sub_regions), item => item.id === filterData.datosSubRegion.id);
        break;
      case 'region':
        itemChart = _.find((datosPaisChart.regions), item => item.id === filterData.datosRegion.id);
        break;
      case 'pais':
        itemChart = datosPaisChart;
        break;
    };

    return itemChart;
  }
  
  /* Factory que crea la grafica */
  createBarChart(label, data, dates, barChart, style) {
    return new Chart(barChart.nativeElement, {
      type: style,
      data: {
        labels:dates,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: style === 'line' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 255)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(0, 0, 255)',// array should have same number of elements as number of dataset
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  /* Factory que devuelve el tipo de filtro: por pais, por region o por subregion */
  getTypeFilter(filter:any) {
    if (filter.datosSubRegion && filter.datosSubRegion.id) {
      return 'subregion';
    } else if (filter.datosRegion && filter.datosRegion.id) {
      return 'region';
    } else if (filter.datosPais && filter.datosPais.id) {
      return 'pais';
    }
  }
}