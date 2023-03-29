import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';

import { Event } from './event.model';
import { EventService } from './event.service';
import { JwtGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.model';
import { CurrentGqlUser } from 'src/user/user.decorator';

@Resolver(() => Event)
export class EventResolver {
  constructor(private eventService: EventService) {}

  @Query(() => Event)
  @UseGuards(JwtGuard)
  async event(@Args('id') id: number): Promise<Event> {
    return await this.eventService.getEvent(id);
  }

  @Query(() => [Event])
  @UseGuards(JwtGuard)
  async events(): Promise<Event[]> {
    const events = await this.eventService.getEvents();

    return events.map((event) => ({ ...event }));
  }

  @Query(() => [Event])
  @UseGuards(JwtGuard)
  async upcomingEvents(): Promise<Event[]> {
    const events = await this.eventService.getUpcomingEvents();

    return events.map((event) => ({ ...event }));
  }

  @Query(() => [Event])
  @UseGuards(JwtGuard)
  async pastEvents(): Promise<Event[]> {
    const events = await this.eventService.getPastEvents();

    return events.map((event) => ({ ...event }));
  }

  @Mutation(() => Event)
  @UseGuards(JwtGuard)
  async createEvent(
    @Args('title') title: string,
    @Args('description', { nullable: true }) description: string,
    @Args('start', { nullable: true }) start: string,
    @Args('end', { nullable: true }) end: string,
    @CurrentGqlUser() user: User,
  ): Promise<Event> {
    const event = await this.eventService.createEvent({
      title,
      description,
      start,
      end,
      userId: user.id,
    });

    return { ...event, createdBy: user };
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  async participate(
    @Args('eventId') eventId: number,
    @CurrentGqlUser() user: User,
  ): Promise<User> {
    const event = await this.eventService.getEvent(eventId);
    if (!event) {
      throw new NotFoundException({
        error: 'This event does not exists',
      });
    }
    const participating = await this.eventService.participate(event, user);

    return participating ? user : null;
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  async cancelParticipation(
    @Args('eventId') eventId: number,
    @CurrentGqlUser() user: User,
  ): Promise<User | null> {
    const event = await this.eventService.getEvent(eventId);
    if (!event) {
      throw new NotFoundException({
        error: 'This event does not exists',
      });
    }
    const canceled = await this.eventService.cancelParticipation(event, user);

    return canceled ? user : null;
  }
}
