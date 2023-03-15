import { Field, InputType } from '@nestjs/graphql';

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

  @Field(() => Number)
  userId: number;
}
