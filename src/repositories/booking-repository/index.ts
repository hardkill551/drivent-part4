import { prisma } from "@/config"

async function getBooking(userId:number) { 
    const booking = await prisma.booking.findFirst({
        where:{
            userId
        },
        include:{
            Room: true
        }
    })
    return booking
}
async function getRoom(roomId:number) { 
    const booking = await prisma.room.findFirst({
        where:{
            id:roomId
        }
    })
    return booking
}
async function getRoomCount(roomId:number) { 
    const count = await prisma.booking.findMany({
        where:{
            roomId
        }
    })
    return count
}
async function postBooking(roomId:number, userId:number) {
     const booking = await prisma.booking.create({
        data:{
            roomId,
            userId
        }
    })
    return booking.id
}

async function putBooking(roomId:number, userId:number, bookingId:number) {
    const booking = await prisma.booking.update({
        data:{
            userId,
            roomId
        },
        where:{
            id:bookingId
        }
    })
    return booking.id
}

const bookingRepository = {
    getBooking,
    postBooking,
    putBooking,
    getRoom,
    getRoomCount
}

export default bookingRepository