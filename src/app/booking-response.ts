import { CustomerResponse } from "./customer-response";

export interface BookingResponse {
    bookingId: number;
    hotelName: string;
    roomType: string;
    roomNumber: number;
    checkInDate: string;
    checkOutDate: string;
    bookingDate: string;
    numberOfPersons: number;
    price: number;
    status: string;
    purposeOfVisit: string;
    advanceAmount: number;
    paymentStatus: string;
    customerResponse: CustomerResponse;
}
