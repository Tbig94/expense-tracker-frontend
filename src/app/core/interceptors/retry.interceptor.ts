import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError, timer } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 15000;

const NON_RETRYABLE_STATUS_CODES = [400, 401, 403, 404, 422];

// Végpontok, amikre engedélyezni szeretnénk a retry-t
const ALLOWED_RETRY_ENDPOINTS = ['auth/login', 'auth/register'];

export const retryInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  // Ellenőrizzük, hogy a kérés URL-je tartalmazza-e valamelyik engedélyezett végpontot
  const shouldRetry = ALLOWED_RETRY_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

  // Ha nem a megadott végpontok egyike, retry nélkül engedjük tovább
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

        const delay = RETRY_DELAY_MS * retryCount;
        return timer(delay);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      return throwError(() => error);
    }),
  );
};
