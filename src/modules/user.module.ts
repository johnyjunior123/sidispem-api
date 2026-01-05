import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "src/controllers/user.controller";
import { PrismaService } from "src/services/prisma.service";
import { UserService } from "src/services/user.service";
import { AuthModule } from "./auth.module";

@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService, PrismaService],
    exports: [UserService]
})
export class UsersModule { }