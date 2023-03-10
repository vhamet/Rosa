import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { EventCreateInput } from './event.input';
import { Event } from './event.model';

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
        createdBy: true,
      },
    });
  }

  async getEvents(): Promise<Event[]> {
    return this.prisma.event.findMany({
      include: {
        createdBy: true,
      },
    });
  }
}
