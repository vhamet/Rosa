import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Event as EventClient, Privacy } from '@prisma/client';
import { User } from 'src/user/user.model';
import { Comment } from '../comment/comment.model';

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

  @Field(() => String, {
    nullable: true,
  })
  pictureUrl: string;

  @Field(() => String)
  privacy: Privacy;

  @Field(() => User)
  createdBy?: User;

  @Field(() => Int)
  userId: number;

  @Field(() => [User])
  participants: User[];

  @Field(() => [Comment])
  comments: User[];
}
