import { Module } from "@nestjs/common";
import { AppointmentController } from "src/controllers/appointment.controller";
import { AppointmentService } from "src/services/appointment.service";
import { PrismaService } from "src/services/prisma.service";

@Module({
    imports: [],
    controllers: [AppointmentController],
    providers: [AppointmentService, PrismaService],
    exports: [AppointmentService]
})
export class AppointmentModule { }