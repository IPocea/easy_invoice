import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectContractModelComponent } from './select-contract-model.component';

describe('SelectContractModelComponent', () => {
  let component: SelectContractModelComponent;
  let fixture: ComponentFixture<SelectContractModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectContractModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectContractModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
