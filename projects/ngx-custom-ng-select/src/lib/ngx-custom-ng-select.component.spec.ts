import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCustomNgSelectComponent } from './ngx-custom-ng-select.component';

describe('NgxCustomNgSelectComponent', () => {
  let component: NgxCustomNgSelectComponent;
  let fixture: ComponentFixture<NgxCustomNgSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxCustomNgSelectComponent]
    });
    fixture = TestBed.createComponent(NgxCustomNgSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
