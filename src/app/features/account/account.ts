import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { AccountDto } from '../../auth/login/login';
import { Dialog } from '@angular/cdk/dialog';
import { DeleteAccountDialog } from './delete-account/delete-account-dialog';

@Component({
  selector: 'app-account',
  imports: [],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(Dialog);

  account: AccountDto | null | undefined;

  ngOnInit(): void {
    console.log(`ngoninit`);

    this.authService.getAccountInfo().subscribe({
      next: (data) => {
        this.account = data;
        this.cdr.detectChanges();
      },
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteAccountDialog, {
      width: '600px',
      panelClass: 'custom-dialog',
      backdropClass: 'my-dark-backdrop',
    });
  }
}
