import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { User } from './user.model';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/auth.guard';
import { CurrentUser } from './user.decorator';
import { UserUpdateInput } from './user.input';

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

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  async updateProfile(
    @Args('userId') userId: number,
    @Args('userData') userData: UserUpdateInput,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exists.`);
    }

    if (user.id !== currentUser.id) {
      throw new UnauthorizedException('You cannot update this profile');
    }

    const { username, phone, color } = userData;
    if (user.username !== username) {
      const checkUser = await this.userService.getUserByUsername(username);
      if (checkUser.id !== user.id) {
        throw new ConflictException(`Username '${username}' is already used`);
      }
    }

    const updatedUser = await this.userService.updateUser(userId, {
      username,
      phone,
      color,
    });

    return updatedUser;
  }
}
