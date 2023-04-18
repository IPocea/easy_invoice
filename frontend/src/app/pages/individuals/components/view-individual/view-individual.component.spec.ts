import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIndividualComponent } from './view-individual.component';

describe('ViewIndividualComponent', () => {
  let component: ViewIndividualComponent;
  let fixture: ComponentFixture<ViewIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIndividualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
