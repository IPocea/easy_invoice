import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableIndividualComponent } from './mat-table-individual.component';

describe('MatTableIndividualComponent', () => {
  let component: MatTableIndividualComponent;
  let fixture: ComponentFixture<MatTableIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTableIndividualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatTableIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
