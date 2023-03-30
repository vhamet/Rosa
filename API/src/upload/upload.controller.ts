import {
  Controller,
  Get,
  NotFoundException,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/auth.guard';
import { EventService } from 'src/event/event.service';
import { User } from 'src/user/user.model';
import { CurrentUser } from '../user/user.decorator';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly eventService: EventService,
  ) {}

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
    @CurrentUser() user: User,
    @Args('eventId') eventId?: number,
  ): Promise<string> {
    if (eventId) {
      const event = await this.eventService.getEvent(+eventId);
      if (!event) {
        throw new NotFoundException(`Event with id ${eventId} does not exists`);
      }
      if (event.createdBy.id !== user.id) {
        throw new UnauthorizedException(
          'You don not have permission to update this event',
        );
      }
    }
    return await this.uploadService.saveEventPicture(file, +eventId);
  }
}
