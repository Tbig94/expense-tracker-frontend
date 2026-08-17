import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    this.authService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
      next: (data) => {
        this.loginResult = data;
        if (this.loginResult?.token !== null) {
          localStorage.setItem(this.TOKEN_KEY, this.loginResult?.token!);
          localStorage.setItem(this.EMAIL_KEY, this.loginResult?.email!);
          this.router.navigate(['/dashboard']);
        }
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
