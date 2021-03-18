import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  controllers: [AuthController],
  providers: [GoogleService, GoogleStrategy],
})
export class AuthModule {}