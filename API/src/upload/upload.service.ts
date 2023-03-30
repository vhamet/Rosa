import { Injectable } from '@nestjs/common';
import { createWriteStream, unlink } from 'fs';
import * as path from 'path';
import { v4 as generateUuid } from 'uuid';
import * as mime from 'mime-types';

import { PrismaService } from '../prisma.service';
import { User } from 'src/user/user.model';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  private savePicture(file: Express.Multer.File): string {
    const uuid = generateUuid();
    const extension = mime.extension(file.mimetype);
    const filename = `${uuid}.${extension}`;
    const pathname = path.join(__dirname, '..', '../public', filename);

    const ws = createWriteStream(pathname);
    ws.write(file.buffer);

    return filename;
  }

  async saveProfilePicture(
    user: User,
    file: Express.Multer.File,
  ): Promise<string> {
    const savedFilename = this.savePicture(file);

    const { pictureUrl } = await this.prisma.user.findUnique({
      select: { pictureUrl: true },
      where: { id: user.id },
    });
    if (pictureUrl) {
      unlink(
        path.join(__dirname, '..', '..', pictureUrl),
        (err) =>
          err && console.error(`Error removing picture ${pictureUrl}:\n${err}`),
      );
    }

    const pathname = `/public/${savedFilename}`;
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: { pictureUrl: pathname },
    });

    return pathname;
  }

  async saveEventPicture(
    file: Express.Multer.File,
    eventId?: number,
  ): Promise<string> {
    const savedFilename = this.savePicture(file);
    const pathname = `/public/${savedFilename}`;

    if (eventId) {
      const { pictureUrl } = await this.prisma.event.findUnique({
        select: { pictureUrl: true },
        where: { id: eventId },
      });
      if (pictureUrl) {
        unlink(
          path.join(__dirname, '..', '..', pictureUrl),
          (err) =>
            err &&
            console.error(`Error removing picture ${pictureUrl}:\n${err}`),
        );
      }

      await this.prisma.event.update({
        where: {
          id: eventId,
        },
        data: { pictureUrl: pathname },
      });
    }

    return pathname;
  }
}
