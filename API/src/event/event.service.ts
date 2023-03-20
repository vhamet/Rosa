import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma.service';
import { EventCreateInput } from './event.input';
import { Event } from './event.model';

const SAFE_USER_FIELDS = {
  select: { id: true, username: true, createdAt: true, phone: true },
};

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent({
    title,
    description,
    start,
    end,
    userId,
  }: EventCreateInput): Promise<Event> {
    return this.prisma.event.create({
      data: {
        title,
        description,
        start: moment(start, 'YYYY-MM-DD').toDate(),
        end: moment(end, 'YYYY-MM-DD').toDate(),
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

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return this.prisma.event.findMany({
      include: {
        createdBy: SAFE_USER_FIELDS,
      },
      where: {
        OR: [
          { start: null, end: null },
          {
            start: { gte: now },
          },
          {
            start: { lt: now },
            end: { gt: now },
          },
        ],
      },
      orderBy: {
        start: { sort: 'asc', nulls: 'last' },
      },
    });
  }

  async getPastEvents(): Promise<Event[]> {
    return this.prisma.event.findMany({
      include: {
        createdBy: SAFE_USER_FIELDS,
      },
      where: {
        OR: [
          { end: { lt: new Date() } },
          {
            end: null,
            start: { lt: new Date() },
          },
        ],
      },
      orderBy: {
        start: { sort: 'desc' },
      },
    });
  }
}
