import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Homepage } from './homepage/homepage';
import { HotelManagement } from './hotel-management/hotel-management';
import { RoomManagement } from './room-management/room-management';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Login', component: Login },
  { path: 'signup', title: 'Sign Up', component: Signup },
  { path: 'home', title: 'Home Page', component: Homepage },
  { path: 'hotel-management', component: HotelManagement,
    children: [
      // { path: 'add', component: AddHotel },
      // { path: 'list', component: ListAllHotels },
      // default view
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  { path: 'room-management', title: 'Room Management', component: RoomManagement,
    children: [
      // { path: 'add', component: AddRoom},
      // { path: 'list', component: ListAllRooms},
      // default view
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
   },
];
