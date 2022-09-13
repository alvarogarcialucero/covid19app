import { Component, ViewChild } from '@angular/core';
import { Covid19Service } from '../../services/covid19.service';
import { IonInfiniteScroll, ModalController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-pais',
  templateUrl: './pais.page.html',
  styleUrls: ['./pais.page.scss'],
})
export class PaisPage {

  @ViewChild(IonInfiniteScroll) infiniteScroll:IonInfiniteScroll;

  paises:any[] = [];

  buscadorPais:string;

  pageInicio:number = 0;

  loading:boolean;

  typeSearch:string;

  constructor( private _covidService:Covid19Service,
               public navParams:NavParams,
               public modalController:ModalController ) {
    this.buscadorPais = '';
    this.pageInicio = 0;

    //Obtenemos el tipo de busqueda (pais, region, subregion)
    this.typeSearch = this.navParams.get('typeSearch');

    this.loading = true;

    if (this.typeSearch === 'region') {
      this.getRegiones(this.navParams.get('country'));
    } else if (this.typeSearch === 'subregion') {
      this.getSubRegiones(this.navParams.get('country'), this.navParams.get('region'));
    } else {
      this.getCountries();
    }
  }

  getRegiones(country:string) {
    this._covidService.getRegiones(country).subscribe( (regiones:any[]) => {
      this.paises = regiones;
      //Ordenamos la lista por nombre
      this.paises.sort((a,b) => a.nombre.localeCompare(b.nombre));
      this.loading = false;
    });
  }

  getSubRegiones(country:string, region:string) {
    this._covidService.getSubRegiones(country, region).subscribe( (paises:any[]) => {
      this.paises = paises;
      //Ordenamos la lista por nombre
      this.paises.sort((a,b) => a.nombre.localeCompare(b.nombre));
      this.loading = false;
    });
  }

  getCountries() {
    this._covidService.getCountries().subscribe( (paises:any[]) => {
      this._covidService.getCountriesNarrativa().subscribe( (paisesNarrativa:any[]) => {
        for (var i=0; i<paisesNarrativa.length; i++) {
          let j:number = 0;
          let encontrado:boolean = false;

          while (j<paises.length && !encontrado) {
            encontrado = paises[j].nombre.toLowerCase() === paisesNarrativa[i].nombre.toLowerCase();
            if (encontrado) {
              let pais = {
                'id': paisesNarrativa[i].id,
                'nombre': paisesNarrativa[i].description,
                'imagen': paises[j].imagen
              };
              this.paises.push(pais);
            }
            j++;
          }
        }

        //Introducimos paises no mergeados correctamente
        this.paises.push(
          {'id': 'us','nombre': 'EE.UU','imagen': 'https://restcountries.eu/data/usa.svg'},
          {'id': 'bolivia','nombre': 'Bolivia','imagen': 'https://restcountries.eu/data/bol.svg'},
        );

        //Ordenamos la lista por nombre
        this.paises.sort((a,b) => a.nombre.localeCompare(b.nombre));
        this.loading = false;
      });
    });
  }

  buscarPais(texto) {
    this.buscadorPais = texto.detail.value;
  }

  consultarPais(pais:any) {
    this.modalController.dismiss(pais);
  }

  nextPageCountry() {
    setTimeout(() => {
      this.pageInicio = 20 + this.pageInicio;
      this.infiniteScroll.complete();

      if (this.pageInicio >= this.paises.length) {
        this.infiniteScroll.disabled = true;
      }
    }, 500);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
