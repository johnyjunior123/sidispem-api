import { Module } from '@nestjs/common';
import { AssociateController } from 'src/controllers/associate.controller';
import { AssociateService } from 'src/services/associate.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
    imports: [],
    controllers: [AssociateController],
    providers: [AssociateService, PrismaService],
    exports: [AssociateService]
})
export class AssociateModule { }
