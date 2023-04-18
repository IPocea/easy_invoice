import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableUsersComponent } from './mat-table-users.component';

describe('MatTableUsersComponent', () => {
  let component: MatTableUsersComponent;
  let fixture: ComponentFixture<MatTableUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTableUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatTableUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
