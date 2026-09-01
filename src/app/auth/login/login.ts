import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly TOKEN_KEY = 'userToken';
  private readonly EMAIL_KEY = 'userEmail';

  private readonly authService = inject(AuthService);
  private readonly snackbarService = inject(SnackbarService);
  private router = inject(Router);

  hide = signal(true);
  isLoading = signal(false);

  loginResult?: LoginResultDto;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.loginForm.disable();

    this.authService
      .login(this.loginForm.get('email')?.value!, this.loginForm.get('password')?.value!)
      .subscribe({
        next: (data) => {
          this.loginResult = data;
          if (this.loginResult?.token !== null) {
            this.snackbarService.success('Logged in successfully');
            this.router.navigate(['/dashboard']);
          }
          this.loginForm.enable();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.loginForm.enable();
        },
      });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}

interface LoginResultDto {
  token: string;
  expiresAt: Date;
  userId: string;
  email: string;
}

export interface AccountDto {
  email: string | null | undefined;
  name: string | null | undefined;
}
