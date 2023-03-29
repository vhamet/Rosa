import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';

import { Comment } from './comment.model';
import { CommentService } from './comment.service';
import { JwtGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/user.model';
import { CurrentGqlUser } from 'src/user/user.decorator';
import { EventService } from 'src/event/event.service';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private commentService: CommentService,
    private eventService: EventService,
  ) {}

  @Mutation(() => Comment)
  @UseGuards(JwtGuard)
  async createComment(
    @Args('eventId') eventId: number,
    @Args('content') content: string,
    @CurrentGqlUser() user: User,
  ): Promise<Comment> {
    const event = await this.eventService.getEvent(eventId);
    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} does not exists.`);
    }
    const comment = await this.commentService.createComment({
      eventId,
      content,
      userId: user.id,
    });

    return { ...comment, author: user };
  }
}
