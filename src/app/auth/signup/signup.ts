import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly authService = inject(AuthService);

  loginResult?: LoginResultDto;

  signupForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    this.authService
      .register(
        this.signupForm.value.name!,
        this.signupForm.value.email!,
        this.signupForm.value.password!,
      )
      .subscribe({
        next: (data) => {
          //this.loginResult = data;
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
