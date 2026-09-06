import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { timer, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';

const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 15000;
const NON_RETRYABLE_STATUS_CODES = [400, 401, 403, 404, 422];
const ALLOWED_RETRY_ENDPOINTS = ['Auth/Login', 'Auth/Register', 'Auth/GetAccountInfo'];

export const retryInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const shouldRetry = ALLOWED_RETRY_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));
  if (!shouldRetry) {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,

      delay: (error: HttpErrorResponse, retryCount: number) => {
        if (NON_RETRYABLE_STATUS_CODES.includes(error.status)) {
          return throwError(() => error);
        }
        return timer(RETRY_DELAY_MS);
      },
    }),
  );
};
