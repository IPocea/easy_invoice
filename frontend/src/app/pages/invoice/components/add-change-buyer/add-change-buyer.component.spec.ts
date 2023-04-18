import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChangeBuyerComponent } from './add-change-buyer.component';

describe('AddChangeBuyerComponent', () => {
  let component: AddChangeBuyerComponent;
  let fixture: ComponentFixture<AddChangeBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChangeBuyerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChangeBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
