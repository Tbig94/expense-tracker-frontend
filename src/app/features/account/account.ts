import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Dialog } from '@angular/cdk/dialog';
import { DeleteAccountDialog } from './delete-account/delete-account-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AccountDto } from '../../shared/models/AccountDto.model';

@Component({
  selector: 'app-account',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  private authService = inject(AuthService);
  private dialog = inject(Dialog);

  account: AccountDto = new AccountDto();

  ngOnInit(): void {
    this.account.email = this.authService.currentUser()!.email;
    this.account.name = this.authService.currentUser()!.name;
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteAccountDialog, {
      width: '750px',
      panelClass: 'custom-dialog',
      backdropClass: 'my-dark-backdrop',
    });
  }
}
