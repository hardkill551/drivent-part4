import { getBooking, postBooking, putBooking } from "@/controllers/booking-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { bookingSchema } from "@/schemas/booking-schemas";
import { Router } from "express";

const bookingRouter = Router()

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', validateBody(bookingSchema), postBooking)
    .put('/:bookingId', validateBody(bookingSchema), putBooking)

export default bookingRouter