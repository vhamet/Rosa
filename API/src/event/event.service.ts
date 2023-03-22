import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma.service';
import { User } from 'src/user/user.model';
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
    const event = await this.prisma.event.create({
      data: {
        title,
        description,
        start: moment(start, 'YYYY-MM-DD').toDate(),
        end: moment(end, 'YYYY-MM-DD').toDate(),
        userId,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return {
      ...event,
      participants: event.participants.map(({ user }) => user),
    };
  }

  async getEvent(id: number): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: SAFE_USER_FIELDS,
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return {
      ...event,
      participants: event.participants.map(({ user }) => user),
    };
  }

  async getEvents(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      include: {
        createdBy: SAFE_USER_FIELDS,
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return events.map((event) => ({
      ...event,
      participants: event.participants.map(({ user }) => user),
    }));
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    const events = await this.prisma.event.findMany({
      include: {
        createdBy: SAFE_USER_FIELDS,
        participants: {
          include: {
            user: true,
          },
        },
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

    return events.map((event) => ({
      ...event,
      participants: event.participants.map(({ user }) => user),
    }));
  }

  async getPastEvents(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      include: {
        createdBy: SAFE_USER_FIELDS,
        participants: {
          include: {
            user: true,
          },
        },
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

    return events.map((event) => ({
      ...event,
      participants: event.participants.map(({ user }) => user),
    }));
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
