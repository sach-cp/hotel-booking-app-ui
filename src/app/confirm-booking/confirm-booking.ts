import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BookingRequest } from '../booking-request';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-confirm-booking',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './confirm-booking.html',
  styleUrl: './confirm-booking.css',
})
export class ConfirmBooking {
  hotelServiceUrl = environment.hotelServiceUrl;
  isSubmitting = false;

  hotelName: string = '';
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  numberOfTravellers: number = 0;
  roomId: number = 0;
  roomNumber: number = 0;
  roomType: string = '';
  price: number = 0;
  advanceAmount: number = 0;
  paymentMode: string = '';
  paymentStatus: string = '';

  numberOfNights: number = 0;
  totalPrice: number = 0;

  userForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    addressDetails: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    pincode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    purposeOfVisit: new FormControl('', Validators.required),
    advanceAmount: new FormControl('', [Validators.required, Validators.min(500)]),
    paymentMode: new FormControl('', Validators.required),
    paymentStatus: new FormControl('', Validators.required)
  });

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  alertMessage = '';
  alertType: 'success' | 'danger' | '' = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log("Booking data:", params);

      this.hotelName = params['hotelName'];

      // Convert to actual Date objects
      this.checkInDate = params['checkInDate'] ? new Date(params['checkInDate']) : null;
      this.checkOutDate = params['checkOutDate'] ? new Date(params['checkOutDate']) : null;

      this.numberOfTravellers = Number(params['numberOfTravellers']);
      this.roomId = Number(params['roomId']);
      this.roomNumber = Number(params['roomNumber']);
      this.roomType = params['roomType'];
      this.price = Number(params['price']);

      this.calculatePrice();
    });
  }

  calculatePrice() {
    if (!this.checkInDate || !this.checkOutDate) return;

    const diffTime = Math.abs(
      this.checkOutDate.getTime() - this.checkInDate.getTime()
    );

    this.numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.totalPrice = this.numberOfNights * this.price;
  }

  onSubmit() {
    const bookingData: BookingRequest = {
      roomId: this.roomId,
      numberOfPersons: this.numberOfTravellers,

      customerDto: {
        firstName: this.userForm.value.firstName!,
        lastName: this.userForm.value.lastName!,

        addressDto: {
          addressDetails: this.userForm.value.addressDetails!,
          city: this.userForm.value.city!,
          state: this.userForm.value.state!,
          country: this.userForm.value.country!,
          pinCode: this.userForm.value.pincode!,
        },
        phoneNumber: this.userForm.value.phoneNumber!,
      },

      checkInDate: this.checkInDate?.toISOString().split('T')[0]!,
      checkOutDate: this.checkOutDate?.toISOString().split('T')[0]!,

      purposeOfVisit: this.userForm.value.purposeOfVisit!,
      totalAmount: this.totalPrice,
      advanceAmount: Number(this.userForm.value.advanceAmount),
      paymentMode: this.userForm.value.paymentMode!,
      paymentStatus: this.userForm.value.paymentStatus!
    };

    // Prevent double submission
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    // Set headers
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post(`${this.hotelServiceUrl}/api/v1/bookings/rooms/${this.roomId}`, bookingData, {
      headers, responseType: 'text'
    }).subscribe({
      next: (responseText: string) => {
        console.log('✅ Server response (text):', responseText);
        this.userForm.reset();
        alert('Room booked successfully!');
      },
      error: (err) => {
        console.error('❌ Error sending booking data:', err);
        let errorMessage = 'Failed to book room. ';

        if (err.status === 0) {
          errorMessage += 'Cannot reach the server. Please check if the server is running.';
        } else if (err.status === 403) {
          errorMessage += 'Not authorized.';
        } else if (err.error?.message) {
          errorMessage += err.error.message;
        } else {
          errorMessage += 'Please try again.';
        }

        this.showMessage(errorMessage, 'danger');
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
