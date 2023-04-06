import { Field, InputType } from '@nestjs/graphql';
import { Privacy } from '@prisma/client';

@InputType()
export class EventCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  start: string;

  @Field(() => String)
  end: string;

  @Field(() => String)
  pictureUrl: string;

  @Field(() => Privacy)
  privacy: Privacy;

  @Field(() => Number)
  userId: number;
}

@InputType()
export class EventUpdateInput {
  @Field(() => String, {
    nullable: false,
  })
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  start: string;

  @Field(() => String)
  end: string;

  @Field(() => Privacy)
  privacy: Privacy;
}
