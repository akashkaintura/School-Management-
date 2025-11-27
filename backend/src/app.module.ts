import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { ParentsModule } from './modules/parents/parents.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { ResultsModule } from './modules/results/results.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ClassesModule } from './modules/classes/classes.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { InvitationsModule } from './modules/invitations/invitations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    ParentsModule,
    AttendanceModule,
    MeetingsModule,
    ResultsModule,
    FinanceModule,
    ClassesModule,
    NotificationsModule,
    SuperAdminModule,
    RegistrationModule,
    SchoolsModule,
    SubjectsModule,
    InvitationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
