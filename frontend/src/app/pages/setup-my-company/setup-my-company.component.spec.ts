import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupMyCompanyComponent } from './setup-my-company.component';

describe('SetupMyCompanyComponent', () => {
  let component: SetupMyCompanyComponent;
  let fixture: ComponentFixture<SetupMyCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupMyCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupMyCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
