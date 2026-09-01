import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { AccountDto } from '../../auth/login/login';
import { Dialog } from '@angular/cdk/dialog';
import { DeleteAccountDialog } from './delete-account/delete-account-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-account',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(Dialog);

  account: AccountDto | null | undefined;

  ngOnInit(): void {
    this.account!.email = this.authService.currentUser()?.email;
    this.account!.name = this.authService.currentUser()?.name;
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteAccountDialog, {
      width: '750px',
      panelClass: 'custom-dialog',
      backdropClass: 'my-dark-backdrop',
    });
  }
}
