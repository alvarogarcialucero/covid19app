import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {

  zonaFavorita:any = {
    datosPais: {}
  };

  subscription:Subscription;

  constructor(private _activatedRoute:ActivatedRoute,
    public alertController: AlertController,
    private _router:Router) { }

  ngOnInit() {
    const clickEstrella = fromEvent(window, 'click-estrella');
  
    this.subscription = clickEstrella.subscribe((evt: any) => {
      this.zonaFavorita = evt.detail;
    });

    this._checkHasFavourite();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  redirectToDatosPais(){
   if(this._checkHasFavourite()){
    sessionStorage.setItem('favouriteView','true');
    if(window.location.href.indexOf('favorito') > -1){
      this._router.navigate(["/tabs/pais/datos-pais",{}]);
    }else{
      this._router.navigate(["/tabs/favorito",{}]);
    }
  }else{
    this.presentAlert();
  } 
}

private _checkHasFavourite(){
  let misZonas = JSON.parse(localStorage.getItem('misZonas'));
  let hasFavourite = false
  if(misZonas){
    misZonas.forEach(zona => {
      if (zona.esFavorita) {
        hasFavourite = true;
        this.zonaFavorita = zona;
      }
    });
  }
 return hasFavourite;
}

async presentAlert() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Atención',
    subHeader: 'No existe una zona favorita',
    message: 'Al buscar por una zona puedes establecerla como favorita',
    buttons: ['OK']
  });

  await alert.present();
}

}
