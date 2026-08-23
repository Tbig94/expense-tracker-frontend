import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly TOKEN_KEY = 'userToken';
  private readonly EMAIL_KEY = 'userEmail';

  private readonly authService = inject(AuthService);
  private router = inject(Router);

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

    this.authService.login(this.email?.value!, this.password?.value!).subscribe({
      next: (data) => {
        this.loginResult = data;
        if (this.loginResult?.token !== null) {
          localStorage.setItem(this.TOKEN_KEY, this.loginResult?.token!);
          localStorage.setItem(this.EMAIL_KEY, this.loginResult?.email!);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => {
        alert('Failed to log in!');
      },
    });
  }
}

interface LoginData {
  email: string;
  password: string;
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
