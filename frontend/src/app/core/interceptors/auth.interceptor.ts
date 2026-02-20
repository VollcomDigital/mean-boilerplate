import { HttpInterceptorFn } from '@angular/common/http';

const AUTH_HEADER = 'Authorization';

/**
 * Attaches JWT token to outgoing API requests if available in localStorage.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set(AUTH_HEADER, `Bearer ${token}`),
    });
    return next(cloned);
  }

  return next(req);
};
