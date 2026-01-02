import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { HotelResponse } from '../hotel-response';

@Component({
  selector: 'app-list-all-hotels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-all-hotels.html',
  styleUrl: './list-all-hotels.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ListAllHotels implements OnInit {
  apiGatewayUrl = environment.apiGatewayUrl;
  hotelList: HotelResponse[] = [];

  alertMessage = '';
  alertType: 'success' | 'danger' | '' = '';

  constructor(@Inject(PLATFORM_ID) private platformId: object, private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getHotels();
    }
  }

  getHotels() {
    const headers = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    this.http
      .get<HotelResponse[]>(`${this.apiGatewayUrl}/api/v1/hotels`, { headers })
      .subscribe({
        next: (response) => {
          this.hotelList = response;
          this.cdr.detectChanges();

          if (this.hotelList.length === 0) {
            this.showMessage('No hotels found.', 'danger');
          } else {
            this.clearMessage();
          }
        },
        error: (err) => {
          console.error('❌ Error fetching hotel data:', err);

          let errorMessage = 'Failed to retrieve hotel data. ';

          if (err.status === 0) {
            errorMessage += 'Cannot reach the server.';
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

  // ✅ Bootstrap alert helpers
  showMessage(message: string, type: 'success' | 'danger') {
    this.alertMessage = message;
    this.alertType = type;

    // auto-hide after 5 seconds
    setTimeout(() => this.clearMessage(), 5000);
  }

  clearMessage() {
    this.alertMessage = '';
    this.alertType = '';
  }

}
