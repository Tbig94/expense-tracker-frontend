import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { CreateBudgetDialogComponent } from '../../budgets/new-budget/create-budget-dialog.component';
import { AuthService } from '../../../auth/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-account-dialog',
  imports: [MatButtonModule],
  templateUrl: './delete-account-dialog.html',
  styleUrl: './delete-account-dialog.css',
})
export class DeleteAccountDialog {
  private dialogRef = inject(DialogRef<CreateBudgetDialogComponent>);
  private authService = inject(AuthService);

  delete(): void {
    this.authService.deleteAccount().subscribe({
      next: () => {
        this.dialogRef.close();
        this.authService.logout();
      },
      error: (err) => {
        alert('Failed to delete account!');
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
