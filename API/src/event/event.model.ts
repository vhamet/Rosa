import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Event as EventClient } from '@prisma/client';
import { User } from 'src/user/user.model';

@ObjectType()
export class Event implements EventClient {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String, {
    nullable: true,
  })
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  date: Date;

  @Field(() => User)
  createdBy?: User;

  @Field(() => Int)
  userId: number;
}
