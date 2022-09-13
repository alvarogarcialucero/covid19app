import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaisPage } from './pais.page';

describe('PaisPage', () => {
  let component: PaisPage;
  let fixture: ComponentFixture<PaisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
