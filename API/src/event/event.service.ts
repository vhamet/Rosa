import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma.service';

import { User } from '../user/user.model';
import { EventCreateInput } from './event.input';
import { Event } from './event.model';

const SAFE_USER_FIELDS = {
  select: { id: true, username: true, createdAt: true, phone: true },
};

const eventIncludes = {
  createdBy: SAFE_USER_FIELDS,
  participants: {
    include: {
      user: true,
    },
  },
  comments: {
    include: {
      author: true,
    },
  },
};

const toGqlEvent = (event) => ({
  ...event,
  participants: event.participants.map(({ user }) => user),
});

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent({
    title,
    description,
    start,
    end,
    userId,
    pictureUrl,
  }: EventCreateInput): Promise<Event> {
    const event = await this.prisma.event.create({
      data: {
        title,
        description,
        start: moment(start, 'YYYY-MM-DD').toDate(),
        end: moment(end, 'YYYY-MM-DD').toDate(),
        userId,
        pictureUrl,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    return toGqlEvent(event);
  }

  async getEvent(id: number): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: eventIncludes,
    });

    return toGqlEvent(event);
  }

  async getEvents(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      include: eventIncludes,
    });

    return events.map(toGqlEvent);
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    const events = await this.prisma.event.findMany({
      include: eventIncludes,
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

    return events.map(toGqlEvent);
  }

  async getPastEvents(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      include: eventIncludes,
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

    return events.map(toGqlEvent);
  }

  async participate(event: Event, user: User): Promise<boolean> {
    try {
      await this.prisma.participating.create({
        data: {
          eventId: event.id,
          userId: user.id,
        },
      });
    } catch (error) {
      console.error(`Error adding participation:\n${error}`);
      return false;
    }

    return true;
  }

  async cancelParticipation(event: Event, user: User): Promise<boolean> {
    try {
      await this.prisma.participating.delete({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: user.id,
          },
        },
      });
    } catch (error) {
      console.error(`Error canceling participation:\n${error}`);
      return false;
    }

    return true;
  }
}
