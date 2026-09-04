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

  //console.log(`req url: ${req.url}`);

  //console.log('[retryInterceptor]', {
  //  url: req.url,
  //  shouldRetry,
  //});

  if (!shouldRetry) {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,

      delay: (error: HttpErrorResponse, retryCount: number) => {
        //console.log('[retryInterceptor] HTTP error', {
        //  status: error.status,
        //  retryCount,
        //  url: req.url,
        //});

        if (NON_RETRYABLE_STATUS_CODES.includes(error.status)) {
          //console.log(`[retryInterceptor] status ${error.status}, nincs retry`);

          return throwError(() => error);
        }

        //console.log(`[retryInterceptor] retry #${retryCount} ${RETRY_DELAY_MS}ms múlva`);

        return timer(RETRY_DELAY_MS);
      },
    }),
  );
};
