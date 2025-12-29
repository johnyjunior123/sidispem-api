import { Module } from '@nestjs/common';
import { WorkspaceController } from 'src/controllers/workspace.controller';
import { PrismaService } from 'src/services/prisma.service';
import { WorkspaceService } from 'src/services/workspace.service';

@Module({
    imports: [],
    controllers: [WorkspaceController],
    providers: [WorkspaceService, PrismaService],
    exports: [WorkspaceService]
})
export class WorkspaceModule { }
