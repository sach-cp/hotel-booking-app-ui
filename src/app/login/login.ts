import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../login-request';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  apiGatewayUrl = environment.apiGatewayUrl;

  loginForm: FormGroup;
  token = '';

  // Bootstrap alert support
  alertMessage = '';
  alertType: 'success' | 'danger' | '' = '';
  showAlert = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.showBootstrapAlert('Please fill all required fields', 'danger');
      return;
    }

    const loginData: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.http.post<{ token: string }>(`${this.apiGatewayUrl}/api/v1/users/login`, loginData)
      .subscribe({
        next: (res) => {
          console.log('✅ Received token object:', res);

          // ✅ ONLY the JWT
          localStorage.setItem('token', res.token);

          console.log(
            '✅ Token stored:',
            localStorage.getItem('token')
          );
          this.token = res.token;
          this.loginForm.reset();
          this.router.navigate(['/home']);
          this.showBootstrapAlert('Login successful!', 'success');
          console.log('✅ Login successful, token stored.', localStorage.getItem('token'));
        },
        error: (err) => {
          let msg = 'Login failed. Please try again.';
          if (err.status === 0) msg = 'Server unreachable.';
          else if (err.status === 401 || err.status === 403) msg = 'Invalid credentials.';
          this.showBootstrapAlert(msg, 'danger');
        }
      });
  }

  private showBootstrapAlert(message: string, type: 'success' | 'danger') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    setTimeout(() => { this.showAlert = false; }, 4000);
  }
}
