import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css',
})
export class Menubar {
  showMenu = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const current = this.router.url;
      this.showMenu =
        !current.includes('/login') &&
        !current.includes('/signup');
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

}
