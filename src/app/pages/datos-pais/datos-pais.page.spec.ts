import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosPaisPage } from './datos-pais.page';

describe('DatosPaisPage', () => {
  let component: DatosPaisPage;
  let fixture: ComponentFixture<DatosPaisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosPaisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPaisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
