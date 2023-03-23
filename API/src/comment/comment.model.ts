import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment as CommentClient } from '@prisma/client';
import { User } from 'src/user/user.model';
import { Event } from 'src/event/event.model';

@ObjectType()
export class Comment implements CommentClient {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  content: string;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  author?: User;

  @Field(() => Int)
  eventId: number;

  @Field(() => Event)
  event?: Event;

  @Field(() => String)
  createdAt: Date;
}
