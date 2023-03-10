import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { EventCreateInput } from './event.input';
import { Event } from './event.model';

const SAFE_USER_FIELDS = {
  select: { id: true, username: true, createdAt: true, phone: true },
};

@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createEvent({
    title,
    description,
    date,
    userId,
  }: EventCreateInput): Promise<Event> {
    return this.prisma.event.create({
      data: {
        title,
        description,
        date: moment(date, 'YYYY-MM-DD').toDate(),
        userId,
      },
    });
  }

  async getEvent(id: number): Promise<Event> {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: SAFE_USER_FIELDS,
      },
    });
  }

  async getEvents(): Promise<Event[]> {
    return this.prisma.event.findMany({
      include: {
        createdBy: SAFE_USER_FIELDS,
      },
    });
  }
}
