import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarType } from '../../../models/Snackbar.model';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  show(message: string, type: SnackbarType, duration: number = 5000): void {
    const config: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`],
    };

    this.snackBar.open(message, '✕', config);
  }

  success(message: string, duration?: number): void {
    this.show(message, SnackbarType.Success, duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, SnackbarType.Error, duration);
  }
}
