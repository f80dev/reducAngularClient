import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import {HttpClient} from "@angular/common/http";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers:[HttpClient],
    schemas: [NO_ERRORS_SCHEMA]
  }));

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
});
