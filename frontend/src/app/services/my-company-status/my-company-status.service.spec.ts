import { TestBed } from '@angular/core/testing';

import { MyCompanyStatusService } from './my-company-status.service';

describe('MyCompanyStatusService', () => {
  let service: MyCompanyStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCompanyStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
