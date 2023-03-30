import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { CommentModule } from './comment/comment.module';
import { UploadController } from './upload/upload.controller';
import { JwtService } from '@nestjs/jwt';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    UserModule,
    EventModule,
    CommentModule,
    UploadModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      include: [UserModule, EventModule, CommentModule],
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, JwtService],
})
export class AppModule {}
