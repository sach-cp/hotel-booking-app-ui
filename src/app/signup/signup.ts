import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignupRequest } from '../signup-request';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  apiGatewayUrl = environment.apiGatewayUrl;

  signupForm: FormGroup;
  isSubmitting = false;

  // ✅ Bootstrap alert state
  alertMessage = '';
  alertType: 'success' | 'danger' | '' = '';
  showAlert = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid || this.isSubmitting) {
      this.showBootstrapAlert('Please fill all required fields correctly.', 'danger');
      return;
    }

    this.isSubmitting = true;

    const form = this.signupForm.value;

    const userData: SignupRequest = {
      fullName: form.fullName,
      emailId: form.email,
      password: form.password
    };

    this.http.post(`${this.apiGatewayUrl}/api/v1/users/signup`, userData, { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          this.signupForm.reset();
          this.showBootstrapAlert(response || 'User registered successfully!', 'success');
        },
        error: (err) => {
          let errorMessage = 'Signup failed. ';

          if (err.status === 0) {
            errorMessage += 'Server is unreachable.';
          } else if (err.status === 403) {
            errorMessage += 'Not authorized.';
          } else if (err.error) {
            errorMessage += err.error;
          } else {
            errorMessage += 'Please try again.';
          }

          this.showBootstrapAlert(errorMessage, 'danger');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  private showBootstrapAlert(message: string, type: 'success' | 'danger') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }

}
