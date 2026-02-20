import { TestBed } from '@angular/core/testing';
import { AuthTokenService } from './auth-token.service';

describe('AuthTokenService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('stores and reads tokens from localStorage', () => {
    const service = TestBed.inject(AuthTokenService);

    service.setToken('sample-token');
    expect(service.getToken()).toBe('sample-token');
    expect(localStorage.getItem('mean_auth_token')).toBe('sample-token');
  });

  it('clears token state and localStorage', () => {
    const service = TestBed.inject(AuthTokenService);
    service.setToken('sample-token');

    service.clearToken();

    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem('mean_auth_token')).toBeNull();
  });
});
