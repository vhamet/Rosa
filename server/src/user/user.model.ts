import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User as UserClient } from '@prisma/client';

@ObjectType()
export class User implements UserClient {
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

  @Field(() => String)
  password: string;
}
