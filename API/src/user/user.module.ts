import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule],
  providers: [
    UserController,
    UserResolver,
    UserService,
    PrismaService,
    JwtService,
  ],
  exports: [UserController, UserResolver, UserService],
})
export class UserModule {}
