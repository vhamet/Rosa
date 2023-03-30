import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  User as UserClient,
  Participating as ParticipatingClient,
} from '@prisma/client';
import { PartialBy } from 'src/utils/types';

type SafeUserClient = PartialBy<UserClient, 'password'>;
@ObjectType()
export class User implements SafeUserClient {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  username: string;

  @Field(() => String, {
    nullable: true,
  })
  phone: string;

  @Field(() => String, {
    nullable: true,
  })
  pictureUrl: string;

  @Field(() => String, {
    nullable: true,
  })
  color: string;

  @Field(() => String, {
    nullable: true,
  })
  password?: string;
}

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
