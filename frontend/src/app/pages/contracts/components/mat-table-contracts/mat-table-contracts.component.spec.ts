import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableContractsComponent } from './mat-table-contracts.component';

describe('MatTableContractsComponent', () => {
  let component: MatTableContractsComponent;
  let fixture: ComponentFixture<MatTableContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTableContractsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatTableContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
