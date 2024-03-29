import { Injectable } from '@nestjs/common';
import { Role, User as PrismaUser } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { UserCreateInput } from './user.input';
import { User } from './user.model';

type UpdateUserData = {
  username: string;
  phone?: string;
  color?: string;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): Omit<User, Key> {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }

  private userWithoutPassword(prismaUser: PrismaUser): User {
    if (!prismaUser) {
      return null;
    }

    const user = { ...prismaUser };
    return this.exclude(user, ['password']);
  }

  async createUser({ username, password }: UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        username,
        password,
      },
    });

    return this.userWithoutPassword(user);
  }

  async getUserById(id: number, safe = true): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return safe ? this.userWithoutPassword(user) : user;
  }

  async getUserByUsername(username: string, safe = true): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return safe ? this.userWithoutPassword(user) : user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ username: 'asc' }],
    });

    return users.map((user) => this.userWithoutPassword(user));
  }

  async updateUser(idUser: number, userData: UpdateUserData): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: idUser,
      },
      data: userData,
    });

    return this.userWithoutPassword(updatedUser);
  }

  async updateRole(idUser: number, role: Role): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: idUser,
      },
      data: { role },
    });

    return this.userWithoutPassword(updatedUser);
  }
}
