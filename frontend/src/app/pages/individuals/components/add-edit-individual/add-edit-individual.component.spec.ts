import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditIndividualComponent } from './add-edit-individual.component';

describe('AddEditIndividualComponent', () => {
  let component: AddEditIndividualComponent;
  let fixture: ComponentFixture<AddEditIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditIndividualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
