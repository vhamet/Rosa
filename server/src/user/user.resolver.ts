import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';

import { UserCreateInput } from './user.input';
import { User } from './user.model';
import { UserService } from './user.service';

const SALT_ROUNDS = 12;

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
    console.log(bcrypt);
    const encryptedPassword = await bcrypt.hashSync(
      userCreateInput.password,
      SALT_ROUNDS,
    );
    const signedUpUser = await this.userService.createUser({
      ...userCreateInput,
      password: encryptedPassword,
    });

    return signedUpUser;
  }
}
