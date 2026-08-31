import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error && error.error.title) {
        // Szerver által küldött ProblemDetails hiba
        const problem: ProblemDetails = error.error;
        snackbarService.error(problem!.detail || problem.title! || 'An error occured!');
      } else {
        // Hálózati vagy egyéb nem várt hiba
        snackbarService.error('Failed to connect to the server!');
      }

      return throwError(() => error);
    }),
  );
};

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}
