import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from './user.model';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => String)
  @UseGuards(JwtGuard)
  welcome(): string {
    return 'Welcome to Rosa !';
  }
}
