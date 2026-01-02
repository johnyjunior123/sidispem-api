import { Module } from '@nestjs/common';
import { ImportController } from 'src/controllers/import.controller';
import { ImportService } from 'src/services/import.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
    imports: [],
    controllers: [ImportController],
    providers: [ImportService, PrismaService],
    exports: [ImportService]
})
export class ImportModule { }
