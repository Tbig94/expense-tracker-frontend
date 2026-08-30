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

const NON_RETRYABLE_STATUS_CODES = [400, 401, 403, 404, 422];

export const retryInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
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
