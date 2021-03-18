import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GoogleStrategy } from './auth/google.strategy';

@Module({
  imports: [AuthModule],
  providers: [GoogleStrategy],
})
export class AppModule {}
