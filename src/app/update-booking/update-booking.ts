import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookingResponse } from '../booking-response';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-update-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-booking.html',
  styleUrl: './update-booking.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UpdateBooking implements OnInit {
  bookingForm!: FormGroup;
  booking!: BookingResponse;
  hotelServiceUrl = environment.hotelServiceUrl;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private fb: FormBuilder, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.initForm();
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const state = window.history.state as { booking: BookingResponse };

    if (!state || !state.booking) {
      console.warn('No booking found in navigation state');
      this.router.navigate(['/booking-management']);
      return;
    }

    this.booking = state.booking;
    this.populateForm();
  }


  private initForm() {
    this.bookingForm = this.fb.group({
      bookingId: [{ value: '', disabled: true }],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numberOfPersons: ['', Validators.required],
      purposeOfVisit: [''],
      status: ['', Validators.required],
      advanceAmount: [''],
      paymentStatus: ['', Validators.required]
    });
  }

  private populateForm() {
    this.bookingForm.patchValue({
      bookingId: this.booking.bookingId,
      checkInDate: this.booking.checkInDate,
      checkOutDate: this.booking.checkOutDate,
      numberOfPersons: this.booking.numberOfPersons,
      purposeOfVisit: this.booking.purposeOfVisit,
      status: this.booking.status,
      advanceAmount: this.booking.advanceAmount,
      paymentStatus: this.booking.paymentStatus
    });
  }

  onUpdate() {
    if (this.bookingForm.invalid) return;

    const updatedBooking = {
      ...this.booking,
      ...this.bookingForm.getRawValue() // includes disabled bookingId
    };

    this.http.put(
      `${this.hotelServiceUrl}/api/v1/bookings/${this.booking.bookingId}`,
      updatedBooking
    ).subscribe({
      next: () => {
        alert('Booking updated successfully');
        this.router.navigate(['/booking-management']);
      },
      error: (err) => console.error(err)
    });
  }

  onCancel() {
    this.router.navigate(['/booking-management']);
  }
}