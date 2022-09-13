import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltroPage } from './filtro.page';

describe('FiltroPage', () => {
  let component: FiltroPage;
  let fixture: ComponentFixture<FiltroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
