import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://verifikar:NXG3gr!Fq-rs@bC@cluster0.6zgqc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    ),
    UserModule,
    AuthModule,
    FormsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
