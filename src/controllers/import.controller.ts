import {
    Body,
    Controller, Post,
    Res,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ImportService } from 'src/services/import.service';

type AssociateImport = {
    matricula: string
    local: string
    name: string
    cpf: string
    token: string
}

@Controller('import')
export class ImportController {
    constructor(private importService: ImportService) { }

    @Post('/associates')
    @UseInterceptors(FileInterceptor('imgPerfil'))
    async createAssociate(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: AssociateImport,
        @Res() res: Response
    ) {
        if (body.token != process.env.TOKEN_IMPORT) {
            return res.status(400).json({ message: 'Not authorized' })
        }
        const newAssociate = await this.importService.create(body, file)
        return res.status(201).json(newAssociate)
    }
}
