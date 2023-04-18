import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDrawerContentComponent } from './contract-drawer-content.component';

describe('ContractDrawerContentComponent', () => {
  let component: ContractDrawerContentComponent;
  let fixture: ComponentFixture<ContractDrawerContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDrawerContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractDrawerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
