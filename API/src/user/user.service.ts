import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserCreateInput } from './user.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser({ username, password }: UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        username,
        password,
      },
    });
  }

  async getUser(username: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
