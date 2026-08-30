import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError, timer } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 15000;

// Ezeket a státuszkódokat NEM próbálja újra (kliens oldali hibák)
const NON_RETRYABLE_STATUS_CODES = [400, 401, 403, 404, 422];

export const retryInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Ha nem retry-olható hiba (pl. 401 Unauthorized), azonnal dobjuk tovább
        if (NON_RETRYABLE_STATUS_CODES.includes(error.status)) {
          return throwError(() => error);
        }

        console.warn(
          `[RetryInterceptor] Kérés sikertelen (${error.status}), újrapróbálás ${retryCount}/${MAX_RETRIES}... (${RETRY_DELAY_MS}ms múlva)`,
          req.url,
        );

        // Exponenciális backoff: 1. retry = 2s, 2. retry = 4s
        const delay = RETRY_DELAY_MS * retryCount;
        return timer(delay);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('[RetryInterceptor] Minden újrapróbálkozás sikertelen:', req.url, error);
      return throwError(() => error);
    }),
  );
};
