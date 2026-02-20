import type { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const FALLBACK_ERROR_MESSAGE = 'Unexpected API error';

interface ApiErrorEnvelope {
  success?: boolean;
  error?: {
    message?: string;
  };
}

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const envelope = error.error as ApiErrorEnvelope | null;
        const message = envelope?.error?.message ?? error.message ?? FALLBACK_ERROR_MESSAGE;
        return throwError(() => new Error(message));
      }

      return throwError(() => new Error(FALLBACK_ERROR_MESSAGE));
    }),
  );
