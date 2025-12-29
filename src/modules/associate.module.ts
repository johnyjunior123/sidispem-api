import { Module } from '@nestjs/common';
import { AssociateController } from 'src/controllers/associate.controller';
import { AssociateImageController } from 'src/controllers/associate.image.controller';
import { AssociateService } from 'src/services/associate.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
    imports: [],
    controllers: [AssociateController, AssociateImageController],
    providers: [AssociateService, PrismaService],
    exports: [AssociateService]
})
export class AssociateModule { }
