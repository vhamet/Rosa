import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CommentCreateInput } from './comment.input';

import { Comment } from './comment.model';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

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
}
