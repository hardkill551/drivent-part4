import { notFoundError } from "@/errors"
import { Forbidden } from "@/errors/forbidden"
import bookingRepository from "@/repositories/booking-repository"
import enrollmentRepository from "@/repositories/enrollment-repository"
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
    if(!room || !enrollments){
        throw notFoundError()
    }
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollments.id)
    if(roomCount.length>=room.capacity || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw Forbidden()
    const bookingId = await bookingRepository.postBooking(roomId, userId)
    
    return { bookingId }
}

async function putBooking(roomId:number, userId:number, bookingId:number) {
    
    await bookingPutValidate(roomId, userId, bookingId)
    const newbookingId = await bookingRepository.putBooking(roomId, userId, bookingId)
    
    return { bookingId:newbookingId }
}

async function bookingPutValidate(roomId:number, userId:number, bookingId:number) {
    const room = await bookingRepository.getRoom(roomId)
    const roomCount = await bookingRepository.getRoomCount(roomId)
    const booking = await bookingRepository.getBooking(userId)
    if(!room || !bookingId || !booking){
        throw notFoundError()
    }
    if(room.capacity<=roomCount.length || booking.id !== bookingId) throw Forbidden()
    return
}

const bookingService = {
    getBooking,
    postBooking,
    putBooking
}

export default bookingService