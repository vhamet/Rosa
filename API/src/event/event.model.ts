import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Event as EventClient } from '@prisma/client';
import { User } from 'src/user/user.model';

@ObjectType()
export class Event implements EventClient {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  title: string;

  @Field(() => String, {
    nullable: true,
  })
  description: string;

  @Field(() => String, {
    nullable: true,
  })
  start: Date;

  @Field(() => String, {
    nullable: true,
  })
  end: Date;

  @Field(() => User)
  createdBy?: User;

  @Field(() => Int)
  userId: number;
}
