import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { User } from './user.model';
import { UserService } from './user.service';

const SALT_ROUNDS = 12;

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  private generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET_KEY);
  }

  @Query(() => String)
  welcome(): string {
    return 'Welcome to Rosa !';
  }

  @Mutation(() => String)
  async signup(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<string> {
    const encryptedPassword = await bcrypt.hashSync(password, SALT_ROUNDS);

    const existingUser = await this.userService.getUser(username);
    if (existingUser) {
      throw new ConflictException(`Username '${username}' is already used`);
    }

    const signedUpUser = await this.userService.createUser({
      username,
      password: encryptedPassword,
    });
    delete signedUpUser.password;

    return this.generateToken(signedUpUser);
  }

  @Mutation(() => String)
  async signin(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await this.userService.getUser(username);
    if (!user) {
      throw new NotFoundException({
        error: 'No user with this username could be found',
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException({ error: 'Wrong password' });
    }
    delete user.password;

    return this.generateToken(user);
  }
}
