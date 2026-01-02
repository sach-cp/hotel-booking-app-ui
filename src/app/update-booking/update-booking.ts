import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  apiGatewayUrl = environment.apiGatewayUrl;

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
    this.calculatePendingAmount();
  }

  calculatePendingAmount() {
    const checkInCtrl = this.bookingForm.get('checkInDate');
    const checkOutCtrl = this.bookingForm.get('checkOutDate');
    const advanceCtrl = this.bookingForm.get('advanceAmount');

    checkInCtrl?.valueChanges.subscribe(() => this.recalculateAmounts());
    checkOutCtrl?.valueChanges.subscribe(() => this.recalculateAmounts());
    advanceCtrl?.valueChanges.subscribe(() => this.recalculateAmounts());
  }


  private initForm() {
    this.bookingForm = this.fb.group({
      bookingId: [{ value: '', disabled: true }],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numberOfPersons: ['', Validators.required],
      price: [{ value: 0, disabled: true }],
      purposeOfVisit: [''],
      status: ['', Validators.required],
      advanceAmount: [''],
      paymentStatus: ['', Validators.required],
      totalAmount: [{ value: 0, disabled: true }],
      pendingAmount: [{ value: 0, disabled: true }]
    });
  }

  private populateForm() {
    this.bookingForm.patchValue({
      bookingId: this.booking.bookingId,
      checkInDate: this.booking.checkInDate,
      checkOutDate: this.booking.checkOutDate,
      numberOfPersons: this.booking.numberOfPersons,
      price: this.booking.price,
      purposeOfVisit: this.booking.purposeOfVisit,
      status: this.booking.status,
      advanceAmount: this.booking.advanceAmount,
      paymentStatus: this.booking.paymentStatus
    });
    this.recalculateAmounts();
  }

  private recalculateAmounts() {
    const checkIn = this.bookingForm.get('checkInDate')?.value;
    const checkOut = this.bookingForm.get('checkOutDate')?.value;
    const advance = this.bookingForm.get('advanceAmount')?.value || 0;

    const nights = this.calculateNights(checkIn, checkOut);
    const pricePerNight = this.booking.price; // 👈 from BookingResponse

    const totalAmount = nights * pricePerNight;
    const pendingAmount = Math.max(totalAmount - advance, 0);

    this.bookingForm.patchValue(
      {
        totalAmount,
        pendingAmount
      },
      { emitEvent: false }
    );
  }

  private calculateNights(checkIn: string, checkOut: string): number {
    if (!checkIn || !checkOut) return 0;

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    const diffTime = outDate.getTime() - inDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(diffDays, 0);
  }

  onUpdate() {
    if (this.bookingForm.invalid) return;

    const updatedBooking = {
      ...this.booking,
      ...this.bookingForm.getRawValue() // includes disabled bookingId
    };

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    this.http.put(`${this.apiGatewayUrl}/api/v1/bookings/${this.booking.bookingId}`, updatedBooking,
      { headers }).subscribe({
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