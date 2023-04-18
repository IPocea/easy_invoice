import { TestBed } from '@angular/core/testing';

import { MyCompanyService } from './my-company.service';

describe('MyCompanyService', () => {
  let service: MyCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
