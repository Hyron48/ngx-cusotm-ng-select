import { TestBed } from '@angular/core/testing';

import { NgxCustomNgSelectService } from './ngx-custom-ng-select.service';

describe('NgxCustomNgSelectService', () => {
  let service: NgxCustomNgSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCustomNgSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
