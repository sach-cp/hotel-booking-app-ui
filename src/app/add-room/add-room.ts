import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { HotelResponse } from '../hotel-response';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-room.html',
  styleUrl: './add-room.css',
})
export class AddRoom {
  hotelServiceUrl = environment.hotelServiceUrl;
  isSubmitting = false;
  hotelList: HotelResponse[] = [];

  ngOnInit() { this.getHotels(); }

  roomForm = new FormGroup({
    hotelId: new FormControl('', Validators.required),
    roomType: new FormControl('', [Validators.required, Validators.minLength(2)]),
    roomNumber: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(0)])
  });

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  alertMessage = '';
  alertType: 'success' | 'danger' | '' = '';

  getHotels() {
    const headers = new HttpHeaders().set('Accept', 'application/json');

    this.http
      .get<HotelResponse[]>(`${this.hotelServiceUrl}/api/v1/hotels`, { headers })
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

  onSubmit() {
    if (this.roomForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const roomData = this.roomForm.value;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.post(`${this.hotelServiceUrl}/api/v1/hotels/${roomData.hotelId}/rooms`, roomData,
      { headers, responseType: 'text' }
    ).subscribe({
      next: () => {
        this.roomForm.reset();
        alert('Room added successfully!');
      },
      error: () => {
        alert('Failed to add room');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

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
