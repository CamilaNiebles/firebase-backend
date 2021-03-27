import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo-db:27017/verifikar'),
    UserModule,
    AuthModule,
    FormsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
