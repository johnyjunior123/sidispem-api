import { Body, Controller, Get, Post, Res, UseGuards, UsePipes } from "@nestjs/common";
import type { Response } from "express";
import { createUserSchema, type createUserDTO } from "src/dto/user.dto";
import { JwtAuthGuard } from "src/filter/auth/jwt.auth.guard";
import { Roles, UserRolesEnum } from "src/filter/auth/rbac";
import { RolesGuard } from "src/filter/auth/roles.guard";
import { ZodValidationPipe } from "src/pipes/zod.validation.pipe";
import { UserService } from "src/services/user.service";
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UsePipes(new ZodValidationPipe(createUserSchema))
    @Post()
    async create(@Body() { email, name, password }: createUserDTO, @Res() res: Response) {
        const user = await this.userService.createUser({ email, name, password })
        if (user) {
            return res.status(201).json({ message: 'Created successfully' })
        }
        return res.status(400).json({ message: 'invalid informations' })
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRolesEnum.PRESIDENTE, UserRolesEnum.ATENDENTE, UserRolesEnum.ADVOGADO)
    async getAll(@Res() res: Response) {
        return res.status(200).json(await this.userService.getAll())
    }
}