import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from './user.model';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  @UseGuards(JwtGuard)
  async user(@Args('id') id: number): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Query(() => [User])
  @UseGuards(JwtGuard)
  async users(): Promise<User[]> {
    return await this.userService.getUsers();
  }
}
