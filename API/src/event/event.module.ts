import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';

@Module({
  imports: [AuthModule],
  providers: [EventResolver, EventService, PrismaService, JwtService],
  exports: [EventResolver, EventService],
})
export class EventModule {}
