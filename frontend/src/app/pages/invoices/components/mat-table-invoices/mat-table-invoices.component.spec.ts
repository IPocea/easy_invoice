import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableInvoicesComponent } from './mat-table-invoices.component';

describe('MatTableInvoicesComponent', () => {
  let component: MatTableInvoicesComponent;
  let fixture: ComponentFixture<MatTableInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTableInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatTableInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
