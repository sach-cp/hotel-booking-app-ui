import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './room-management.html',
  styleUrl: './room-management.css',
})
export class RoomManagement {

}
