import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Homepage } from './homepage/homepage';
import { HotelManagement } from './hotel-management/hotel-management';
import { RoomManagement } from './room-management/room-management';
import { ListAllHotels } from './list-all-hotels/list-all-hotels';
import { ListAllRooms } from './list-all-rooms/list-all-rooms';
import { AddHotel } from './add-hotel/add-hotel';
import { NewBooking } from './new-booking/new-booking';
import { AddRoom } from './add-room/add-room';
import { ConfirmBooking } from './confirm-booking/confirm-booking';
import { BookingSuccess } from './booking-success/booking-success';
import { BookingManagement } from './booking-management/booking-management';
import { UpdateBooking } from './update-booking/update-booking';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'home', component: Homepage },
  {
    path: 'hotel-management', component: HotelManagement,
    children: [
      { path: 'add', component: AddHotel },
      { path: 'list', component: ListAllHotels },
      // default view
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'room-management', component: RoomManagement,
    children: [
      { path: 'add', component: AddRoom },
      { path: 'list', component: ListAllRooms },
      // default view
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  { path: 'new-booking', component: NewBooking },
  { path: 'confirm-booking', component: ConfirmBooking },
  { path: 'booking-success', component: BookingSuccess },
  { path: 'booking-management', component: BookingManagement },
  { path: 'update-booking', component: UpdateBooking },
];
