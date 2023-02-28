import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserCreateInput } from './user.input';
import { User } from './user.model';
import { UserService } from './user.service';

const SALT_ROUNDS = 12;

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  private generateToken(user) {
    console.log({ env: process.env, key: process.env.JWT_SECRET_KEY });
    return jwt.sign(user, process.env.JWT_SECRET_KEY);
  }
  @Query(() => String)
  welcome(): string {
    return 'Welcome to Rosa !';
  }

  @Mutation(() => User)
  async signup(
    @Args('userCreateInput') userCreateInput: UserCreateInput,
  ): Promise<User> {
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

  @Mutation(() => String)
  async signin(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await this.userService.getUser(username);
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException({ error: 'Wrong password' });
    }
    delete user.password;

    const token = this.generateToken(user);

    return token;
  }
}
