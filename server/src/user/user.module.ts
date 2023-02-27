import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';

@Module({
  controllers: [UserResolver],
})
export class UserModule {}
