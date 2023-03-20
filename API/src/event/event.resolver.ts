import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Event } from './event.model';
import { EventService } from './event.service';
import { JwtGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.model';
import { CurrentUser } from 'src/user/user.decorator';

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
    @CurrentUser() user: User,
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
}
