export interface RoomResponse {
    roomId: number;
    roomType: string;
    roomNumber: number;
    price: number;
    roomStatus: "AVAILABLE" | "CONFIRMED" | "CHECKED_IN";
}
