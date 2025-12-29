import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssociateModule } from './modules/associate.module';
import { WorkspaceModule } from './modules/workspace.module';
import { AppointmentModule } from './modules/appointment.module';
import { UsersModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: false,
    }),
    AssociateModule,
    WorkspaceModule,
    AppointmentModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
