import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Event } from './event.model';
import { EventService } from './event.service';
import { JwtGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.model';
import { CurrentUser } from 'src/user/user.decorator';

@Resolver(() => Event)
export class EventResolver {
  constructor(
    private eventService: EventService,
    private userService: UserService,
  ) {}

  @Query(() => Event)
  @UseGuards(JwtGuard)
  async event(@Args('id') id: number): Promise<Event> {
    const event = await this.eventService.getEvent(id);
    const user = await this.userService.getUserById(event.userId);

    return { ...event, createdBy: user };
  }

  @Query(() => [Event])
  @UseGuards(JwtGuard)
  async events(): Promise<Event[]> {
    const events = await this.eventService.getEvents();

    return events.map((event) => ({ ...event }));
  }

  @Mutation(() => Event)
  @UseGuards(JwtGuard)
  async createEvent(
    @Args('title') title: string,
    @Args('description') description: string,
    @Args('date') date: string,
    @CurrentUser() user: User,
  ): Promise<Event> {
    const event = await this.eventService.createEvent({
      title,
      description,
      date,
      userId: user.id,
    });

    return { ...event, createdBy: user };
  }
}
