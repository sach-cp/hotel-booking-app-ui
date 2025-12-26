import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BookingResponse } from '../booking-response';
import { BookingSummaryResponse } from '../booking-summary-response';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-management.html',
  styleUrl: './booking-management.css',
})
export class BookingManagement implements OnInit {
  hotelServiceUrl = environment.hotelServiceUrl;
  filterForm!: FormGroup;
  booking: BookingResponse | null = null;
  bookings: BookingSummaryResponse[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      searchType: ['bookingId'],
      value: [''],
      singleDate: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  onSearch() {
    const { searchType, value, singleDate, startDate, endDate } = this.filterForm.value;
    let payload: any = { searchType };

    switch (searchType) {
      case 'bookingId':
      case 'email':
      case 'phone':
        payload.value = value;
        break;

      case 'singleDate':
        payload.date = singleDate;
        break;

      case 'dateRange':
        payload.startDate = startDate;
        payload.endDate = endDate;
        break;
    }

    console.log('Search Payload', payload);
    const headers = new HttpHeaders().set('Accept', 'application/json');

    // ✅ 1. Booking ID → Single booking API
    if (searchType === 'bookingId' && value) {
      this.getBookingById(value, headers);
      return;
    }

    // ✅ 2. Everything else → Search API
    const params = this.buildSearchParams(searchType, value, singleDate, startDate, endDate);
    this.searchBookings(params, headers);
  }

  getBookingById(bookingId: string, headers: HttpHeaders) {
    this.http.get<BookingResponse>(`${this.hotelServiceUrl}/api/v1/bookings/${bookingId}`, { headers })
      .subscribe({
        next: (res) => {
          this.booking = res;
          this.bookings = [];
        },
        error: (err) => console.error(err)
      });
  }

  searchBookings(params: any, headers: HttpHeaders) {
    this.http.get<BookingSummaryResponse[]>(`${this.hotelServiceUrl}/api/v1/bookings/search`, { headers, params })
      .subscribe({
        next: (res) => {
          this.bookings = res;
          this.booking = null;
        },
        error: (err) => console.error(err)
      });
  }

  buildSearchParams(searchType: string, value: string, singleDate: string, startDate: string,
    endDate: string) {
    let params: any = {};

    switch (searchType) {
      case 'email':
        params.email = value;
        break;

      case 'phone':
        params.phoneNumber = value;
        break;

      case 'singleDate':
        params.bookingDate = singleDate;
        break;

      case 'dateRange':
        params.fromDate = startDate;
        params.toDate = endDate;
        break;
    }

    return params;
  }


  onReset() { this.filterForm.reset({ searchType: 'bookingId' }); }

  update(booking: BookingResponse) {
    this.router.navigate(['/update-booking'], {
      state: { booking }
    });
  }

  delete(booking: BookingResponse) {
    console.log('Delete booking', booking);
  }

}
