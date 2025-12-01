import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@/lib/auth';
import { AuthController } from './auth.controller';

@Module({
  imports: [BetterAuthModule.forRoot({
    auth,
  })],
  controllers: [AuthController],
})
export class AuthModule {}
