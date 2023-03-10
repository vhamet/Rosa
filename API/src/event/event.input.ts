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
  date: string;

  @Field(() => Number)
  userId: number;
}
