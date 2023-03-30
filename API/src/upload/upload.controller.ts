import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.model';
import { CurrentUser } from '../user/user.decorator';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  upload(): string {
    return 'upload';
  }

  @Post('uploadProfilePicture')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: User,
  ): Promise<string> {
    return await this.uploadService.saveProfilePicture(currentUser, file);
  }

  @Post('uploadEventPicture')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadEventPicture(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: User,
    @Args('eventId') eventId?: number,
  ): Promise<string> {
    return await this.uploadService.saveEventPicture(file, eventId);
  }
}
