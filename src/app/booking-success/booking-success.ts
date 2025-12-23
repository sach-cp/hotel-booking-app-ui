import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingResponse } from '../booking-response';

@Component({
  selector: 'app-booking-success',
  imports: [],
  templateUrl: './booking-success.html',
  styleUrl: './booking-success.css',
})
export class BookingSuccess {
  booking!: BookingResponse;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.booking = navigation?.extras.state?.['booking'];
  }

}
