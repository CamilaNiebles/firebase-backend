import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/verifikar'),
    UserModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {}
