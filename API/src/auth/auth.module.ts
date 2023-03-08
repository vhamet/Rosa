import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AuthResolver, UserService, PrismaService],
  exports: [AuthResolver, UserService],
})
export class AuthModule {}
