import { TestBed } from '@angular/core/testing';

import { ContractModelService } from './contract-model.service';

describe('ContractModelService', () => {
  let service: ContractModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
