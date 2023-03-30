import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [AuthModule],
  providers: [UploadController, UploadService, PrismaService, JwtService],
  exports: [UploadController, UploadService],
})
export class UploadModule {}
