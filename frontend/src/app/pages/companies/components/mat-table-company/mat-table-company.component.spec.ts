import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableCompanyComponent } from './mat-table-company.component';

describe('MatTableCompanyComponent', () => {
  let component: MatTableCompanyComponent;
  let fixture: ComponentFixture<MatTableCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTableCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatTableCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
