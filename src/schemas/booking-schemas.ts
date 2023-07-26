import { RoomId } from "@/protocols";
import Joi from "joi";

export const bookingSchema = Joi.object<RoomId>({
    roomId: Joi.number().required()
  });