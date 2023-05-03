import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTablePaymentsComponent } from './mat-table-payments.component';

describe('MatTablePaymentsComponent', () => {
  let component: MatTablePaymentsComponent;
  let fixture: ComponentFixture<MatTablePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTablePaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatTablePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
