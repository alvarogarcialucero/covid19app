import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class Covid19Service {

  constructor( private _http:HttpClient ) { }

  getSummaryGlobalCovid() {
    return this._http.get('https://api.covid19api.com/summary');
  }

  getCountries() {
    return this._http.get('https://restcountries.eu/rest/v2/all').pipe(map((data:any[]) => {
      let paises:any[] = [];

      data.map(pais => {
        let paisResponse:any = {
          'nombre': pais['name'],
          'imagen': pais['flag'],
          'latlng': pais['latlng'],
          'countryCode': pais['alpha2Code']
        };
        paises.push(paisResponse);
      });
      
      return paises;
    }));
  }

  getCountriesNarrativa() {
    return this._http.get('https://api.covid19tracking.narrativa.com/api/countries').pipe(map((data:any) => {
      let paises:any[] = [];

      data.countries.map(pais => {
        let paisResponse:any = {
          'id': pais['id'],
          'nombre': pais['name'],
          'description': pais['name_es']
        };
        paises.push(paisResponse);
      });
      return paises;
    }));
  }

  getRegiones(country:string) {
    const d:Date = new Date();
    const day:string = d.getDate().toString().length === 1 ? `0${d.getDate()}` : d.getDate().toString();
    const today:string = `${d.getFullYear()}-${(d.getMonth() + 1)}-${day}`;

    return this._http.get(`https://api.covid19tracking.narrativa.com/api/country/${country}?date_from=${today}&date_to=${today}`).pipe(map((data:any) => {
      const listaRegiones:any = Object.values(data.dates[today].countries)[0];
      const regionesAux:any[] = listaRegiones.regions;
      const regiones:any[] = [];

      regionesAux.map( region => {
        let regionResponse:any = {
          'id': region.id,
          'nombre': region.name_es
        };
        regiones.push(regionResponse);
      })

      return regiones;
    }));
  }

  getSubRegiones(country:string, region:string) {
    const today:string = moment().format('YYYY-MM-DD');

    return this._http.get(`https://api.covid19tracking.narrativa.com/api/country/${country}/region/${region}?date_from=${today}&date_to=${today}`).pipe(map((data:any) => {
      const listaRegiones:any = Object.values(data.dates[today].countries)[0];
      const subRegionesAux:any[] = listaRegiones.regions[0].sub_regions;
      const subRegiones:any[] = [];

      subRegionesAux.map( region => {
        let subRegionResponse:any = {
          'id': region.id,
          'nombre': region.name_es
        };
        subRegiones.push(subRegionResponse);
      })

      return subRegiones;
    }));
  }

  getDataCountry(filter:any) {
    let toDate:string = moment().format('YYYY-MM-DD');
    let fromDate:string = moment().subtract(7,'d').format('YYYY-MM-DD');

    if (filter.datosFechas && filter.datosFechas.desdeFormat) {
      fromDate = filter.datosFechas.desdeFormat;
    } else {
      filter.datosFechas.desdeFormat = fromDate;
    }

    if (filter.datosFechas && filter.datosFechas.hastaFormat) {
      toDate = filter.datosFechas.hastaFormat;
    } else {
      filter.datosFechas.hastaFormat = toDate;
    }

    return this._http.get(`https://api.covid19tracking.narrativa.com/api/country/${filter.datosPais.id}?date_from=${fromDate}&date_to=${toDate}`).pipe(map((data:any) => data));
  }
}
