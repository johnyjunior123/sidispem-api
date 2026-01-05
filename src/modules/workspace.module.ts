import { Module } from '@nestjs/common';
import { WorkspaceController } from 'src/controllers/workspace.controller';
import { PrismaService } from 'src/services/prisma.service';
import { WorkspaceService } from 'src/services/workspace.service';
import { AuthModule } from './auth.module';

@Module({
    imports: [AuthModule],
    controllers: [WorkspaceController],
    providers: [WorkspaceService, PrismaService],
    exports: [WorkspaceService]
})
export class WorkspaceModule { }
