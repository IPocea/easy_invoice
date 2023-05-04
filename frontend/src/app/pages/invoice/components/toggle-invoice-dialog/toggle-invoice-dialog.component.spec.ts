import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleInvoiceDialogComponent } from './toggle-invoice-dialog.component';

describe('ToggleInvoiceDialogComponent', () => {
  let component: ToggleInvoiceDialogComponent;
  let fixture: ComponentFixture<ToggleInvoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleInvoiceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleInvoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
