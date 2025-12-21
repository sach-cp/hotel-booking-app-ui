import { ChangeDetectorRef, Component} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { RoomResponse } from '../room-response';
import { HotelResponse } from '../hotel-response';

@Component({
  selector: 'app-new-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-booking.html',
  styleUrl: './new-booking.css',
})
export class NewBooking {
  hotelServiceUrl = environment.hotelServiceUrl;
  bookingForm = new FormGroup({
    destination: new FormControl('', Validators.required),
    checkin: new FormControl('', Validators.required),
    checkout: new FormControl('', Validators.required),
    travellers: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  hotels: string[] = [];
  hotelList: HotelResponse[] = [];
  roomList: RoomResponse[] = [];

  // Bootstrap alert
  alertMessage = '';
  alertType: 'success' | 'danger' | '' = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.getHotels();
  }

  getHotels() {
    const headers = new HttpHeaders().set('Accept', 'application/json');

    this.http.get<HotelResponse[]>(`${this.hotelServiceUrl}/api/v1/hotels`, { headers })
      .subscribe({
        next: (response) => {
          this.hotelList = response;
          this.hotels = response.map(h => h.hotelName);
          this.cdr.detectChanges();

          if (this.hotels.length === 0) {
            this.showMessage('No hotel names found.', 'danger');
          }
        },
        error: () => {
          this.showMessage('Failed to retrieve hotel data.', 'danger');
        }
      });
  }

  onSearch() {
    const hotelName = this.bookingForm.value.destination;
    const headers = new HttpHeaders().set('Accept', 'application/json');

    const formatDate = (d: any) => d ? new Date(d).toISOString().split('T')[0] : '';
    const selectedHotel = this.hotelList.find(hotel => hotel.hotelName.toLowerCase() === hotelName!.toLowerCase());
    if (!selectedHotel) {
      this.showMessage('Select a valid hotel before searching.', 'danger');
      return;
    }
    const hotelId = selectedHotel.hotelId;
    const params = new HttpParams()
      .set('hotelName', this.bookingForm.value.destination || '')
      .set('checkInDate', formatDate(this.bookingForm.value.checkin))
      .set('checkOutDate', formatDate(this.bookingForm.value.checkout));

    this.http.get<RoomResponse[]>(`${this.hotelServiceUrl}/api/v1/hotels/${hotelId}/rooms`, { headers, params })
      .subscribe({
        next: (response) => {
          this.roomList = response;
          console.log('Room status:', response[0]?.roomStatus);
          console.log('Room name list response:', this.roomList);
          this.cdr.markForCheck();

          if (this.roomList.length === 0) {
            this.showMessage('No rooms found.', 'danger');
          }
        },
        error: (err) => {
          console.error('❌ Error fetching hotel data:', err);
          let errorMessage = 'Failed to retrieve room data ';

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
        }
      });
  }

  getRoomClass(room: RoomResponse): string {
    switch (room.roomStatus) {
      case 'AVAILABLE':
        return 'border-success bg-success-subtle';
      case 'CONFIRMED':
        return 'border-warning bg-warning-subtle';
      case 'CHECKED_IN':
        return 'border-danger bg-danger-subtle';
      default:
        return '';
    }
  }

  bookNow(room: RoomResponse) {
    this.router.navigate(['/confirm-booking'], {
      queryParams: {
        hotelName: this.bookingForm.value.destination,
        checkInDate: this.bookingForm.value.checkin,
        checkOutDate: this.bookingForm.value.checkout,
        numberOfTravellers: this.bookingForm.value.travellers,
        roomId: room.roomId,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        price: room.price,
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
