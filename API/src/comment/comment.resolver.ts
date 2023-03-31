import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

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

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
  async deleteComment(
    @Args('commentId') commentId: number,
    @CurrentGqlUser() user: User,
  ): Promise<boolean> {
    const comment = await this.commentService.getComment(commentId);
    if (!comment) {
      throw new NotFoundException({
        error: `Comment with id ${commentId} does not exist`,
      });
    }

    if (comment.author.id !== user.id) {
      throw new UnauthorizedException({
        error: 'You are not allowed to delete this comment',
      });
    }
    await this.commentService.deleteComment(commentId);

    return true;
  }

  @Mutation(() => Comment)
  @UseGuards(JwtGuard)
  async updateComment(
    @Args('commentId') commentId: number,
    @Args('content') content: string,
    @CurrentGqlUser() user: User,
  ): Promise<Comment> {
    const comment = await this.commentService.getComment(commentId);
    if (!comment) {
      throw new NotFoundException(
        `Comment with id ${commentId} does not exists`,
      );
    }
    if (comment.author.id !== user.id) {
      throw new UnauthorizedException(
        'You don not have permission to update this comment',
      );
    }

    const updatedComment = await this.commentService.updateComment(
      commentId,
      content,
    );

    return { ...updatedComment };
  }
}
