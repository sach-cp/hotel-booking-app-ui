import { Component, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { RoomResponse } from '../room-response';
import { HotelResponse } from '../hotel-response';

@Component({
  selector: 'app-list-all-rooms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-all-rooms.html',
  styleUrl: './list-all-rooms.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ListAllRooms {
  hotelServiceUrl = environment.hotelServiceUrl;

  roomForm = new FormGroup({
    hotelName: new FormControl('', Validators.required)
  });

  roomList: RoomResponse[] = [];
  hotelList: HotelResponse[] = [];
  hotels: string[] = [];

  // Bootstrap alert
  alertMessage = '';
  alertType: 'success' | 'danger' | '' = '';

  constructor(@Inject(PLATFORM_ID) private platformId: object, private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getHotels();
    }
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

  getRooms(): void {
    const hotelName = this.roomForm.value.hotelName?.trim();
    if (!hotelName) return;

    const selectedHotel = this.hotelList.find(
      h => h.hotelName.toLowerCase() === hotelName.toLowerCase()
    );

    if (!selectedHotel) {
      this.showMessage('Hotel not found.', 'danger');
      return;
    }

    const headers = new HttpHeaders().set('Accept', 'application/json');
    const params = new HttpParams().set('hotelId', selectedHotel.hotelId);

    this.http
      .get<RoomResponse[]>(
        `${this.hotelServiceUrl}/api/v1/hotels/${selectedHotel.hotelId}/rooms`,
        { headers, params }
      )
      .subscribe({
        next: (response) => {
          this.roomList = response;
          this.cdr.detectChanges();

          if (this.roomList.length === 0) {
            this.showMessage('No rooms found.', 'danger');
          }
        },
        error: () => {
          this.showMessage('Failed to retrieve room data.', 'danger');
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
