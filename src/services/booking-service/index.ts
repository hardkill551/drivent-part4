import { notFoundError } from "@/errors"
import { Forbidden } from "@/errors/forbidden"
import bookingRepository from "@/repositories/booking-repository"
import enrollmentRepository from "@/repositories/enrollment-repository"
import hotelRepository from "@/repositories/hotel-repository"
import ticketsRepository from "@/repositories/tickets-repository"

async function getBooking(userId:number) {
    const booking = await bookingRepository.getBooking(userId)
    if(!booking){
        throw notFoundError()
    }
    return {
        id: booking.id,
        Room: booking.Room
    }
}

async function postBooking(roomId:number, userId:number) {
    const room = await bookingRepository.getRoom(roomId)
    const roomCount = await bookingRepository.getRoomCount(roomId)
    const enrollments = await enrollmentRepository.findWithAddressByUserId(userId)
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollments.id)
    if(!room || !enrollments){
        throw notFoundError
    }
    if(room.capacity<=roomCount || ticket.status === 'RESERVED' || ticket.TicketType.isRemote === false || ticket.TicketType.includesHotel === true) throw Forbidden()
    const bookingId = await bookingRepository.postBooking(roomId, userId)
    return { bookingId }
}

async function putBooking(roomId:number, userId:number, bookingId:number) {
    bookingPutValidate(roomId, userId)
    const newbookingId = await bookingRepository.putBooking(roomId, userId, bookingId)
    return { bookingId:newbookingId }
}

async function bookingPutValidate(roomId:number, userId:number,) {
    const room = await bookingRepository.getRoom(roomId)
    const roomCount = await bookingRepository.getRoomCount(roomId)
    const booking = await bookingRepository.getBooking(userId)
    if(!room){
        throw notFoundError
    }
    if(room.capacity<=roomCount || !booking) throw Forbidden()
}

const bookingService = {
    getBooking,
    postBooking,
    putBooking
}

export default bookingService