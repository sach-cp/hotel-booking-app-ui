import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-management',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './hotel-management.html',
  styleUrl: './hotel-management.css',
})
export class HotelManagement {

}
