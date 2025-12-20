import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { AddHotelRequest } from '../add-hotel-request';

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-hotel.html',
  styleUrl: './add-hotel.css',
})
export class AddHotel {
  apiGatewayUrl = environment.hotelServiceUrl;
  isSubmitting = false;

  alertMessage = '';
  alertType: 'success' | 'danger' | '' = '';

  hotelForm = new FormGroup({
    hotelName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    addressDetails: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    pinCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
    emailId: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (this.hotelForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;

    const hotelData: AddHotelRequest = {
      hotelName: this.hotelForm.value.hotelName!,
      addressDto: {
        addressDetails: this.hotelForm.value.addressDetails!,
        city: this.hotelForm.value.city!,
        state: this.hotelForm.value.state!,
        country: this.hotelForm.value.country!,
        pinCode: this.hotelForm.value.pinCode!,
      },
      phoneNumber: this.hotelForm.value.phoneNumber!,
      emailId: this.hotelForm.value.emailId!
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    this.http.post(`${this.apiGatewayUrl}/api/v1/hotels`, hotelData, {
      headers, responseType: 'text'
    }).subscribe({
      next: (res) => {
        this.hotelForm.reset();
        this.showMessage(res || 'Hotel added successfully!', 'success');
      },
      error: () => {
        this.showMessage('Failed to add hotel.', 'danger');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  showMessage(message: string, type: 'success' | 'danger') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.clearMessage(), 5000);
  }

  clearMessage() {
    this.alertMessage = '';
    this.alertType = '';
  }

}
