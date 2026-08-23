import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly authService = inject(AuthService);
  private router = inject(Router);

  loginResult?: LoginResultDto;

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.authService
      .register(
        this.signupForm.value.name!,
        this.signupForm.value.email!,
        this.signupForm.value.password!,
      )
      .subscribe({
        next: (data) => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Failed to register!');
        },
      });
  }
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginResultDto {
  token: string;
  expiresAt: Date;
  userId: string;
  name: string;
}
