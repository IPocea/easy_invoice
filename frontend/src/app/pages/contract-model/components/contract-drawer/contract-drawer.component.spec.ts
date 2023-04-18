import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDrawerComponent } from './contract-drawer.component';

describe('ContractDrawerComponent', () => {
  let component: ContractDrawerComponent;
  let fixture: ComponentFixture<ContractDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
