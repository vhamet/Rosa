import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { EventService } from '../event/event.service';

@Module({
  imports: [AuthModule],
  providers: [
    CommentResolver,
    CommentService,
    EventService,
    PrismaService,
    JwtService,
  ],
  exports: [CommentResolver, CommentService],
})
export class CommentModule {}
