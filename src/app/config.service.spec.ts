import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import {LocationStrategy} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Platform} from "@angular/cdk/platform";

describe('ConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers:[LocationStrategy,HttpClient,Platform]
  }));

  it('should be created', () => {
    const service: ConfigService = TestBed.get(ConfigService);
    expect(service).toBeTruthy();
  });
});
