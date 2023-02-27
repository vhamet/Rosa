import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserCreateInput } from './user.input';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => User)
  async signup(
    @Args('userCreateInput') userCreateInput: UserCreateInput,
  ): Promise<User> {
    const signedUpUser = await this.userService.createUser(userCreateInput);

    return signedUpUser;
  }
}
