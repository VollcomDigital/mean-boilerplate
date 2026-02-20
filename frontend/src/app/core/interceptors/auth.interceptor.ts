import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenService } from '../services/auth-token.service';

const AUTHORIZATION_HEADER = 'Authorization';
const BEARER_PREFIX = 'Bearer ';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.includes('/api/')) {
    return next(request);
  }

  const authTokenService = inject(AuthTokenService);
  const token = authTokenService.getToken();

  if (!token) {
    return next(request);
  }

  const authorizedRequest = request.clone({
    setHeaders: {
      [AUTHORIZATION_HEADER]: `${BEARER_PREFIX}${token}`,
    },
  });

  return next(authorizedRequest);
};
