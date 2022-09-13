import { TestBed } from '@angular/core/testing';

import { CovidFactoryService } from './covid-factory.service';

describe('CovidFactoryService', () => {
  let service: CovidFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
