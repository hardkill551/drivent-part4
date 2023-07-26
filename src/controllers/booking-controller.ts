import { AuthenticatedRequest } from "@/middlewares";
import { RoomId } from "@/protocols";
import bookingService from "@/services/booking-service";
import { Response } from "express";

export async function getBooking(req:AuthenticatedRequest, res:Response) {
    const { userId } = req
    const booking = bookingService.getBooking(userId)
    res.send(booking)
}


export async function postBooking(req:AuthenticatedRequest, res:Response) {
    const { roomId } = req.body as RoomId
    const { userId } = req
    const bookingId = bookingService.postBooking(roomId, userId)
    res.send(bookingId)
}

export async function putBooking(req:AuthenticatedRequest, res:Response) {
    const { bookingId } = req.params
    const { userId } = req
    const { roomId } = req.body as RoomId
    const booking = bookingService.putBooking(roomId, userId, Number(bookingId))
    res.send(booking)
}