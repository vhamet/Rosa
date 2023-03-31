import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CommentCreateInput } from './comment.input';

import { Comment } from './comment.model';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getComment(id: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    return { ...comment };
  }

  async createComment({
    eventId,
    content,
    userId,
  }: CommentCreateInput): Promise<Comment> {
    return await this.prisma.comment.create({
      data: {
        content,
        eventId,
        userId,
      },
    });
  }

  async deleteComment(id: number): Promise<boolean> {
    await this.prisma.comment.delete({
      where: { id },
    });

    return true;
  }
}
