import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Participating as ParticipatingClient } from '@prisma/client';
import { User } from 'src/user/user.model';

@ObjectType()
export class Participating implements ParticipatingClient {
  @Field(() => Int)
  eventId: number;

  @Field(() => Event)
  event?: Event;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user?: User;

  @Field(() => String)
  createdAt: Date;
}
