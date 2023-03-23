import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CommentCreateInput {
  @Field(() => Number, {
    nullable: false,
  })
  eventId: number;

  @Field(() => String, {
    nullable: false,
  })
  content: string;

  @Field(() => Number)
  userId: number;
}
