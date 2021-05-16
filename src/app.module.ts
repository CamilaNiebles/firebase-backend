// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';
import { ListsModule } from './lists/lists.module';
import { RchilliModule } from './rchilli/rchilli.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.6zgqc.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    ),
    UserModule,
    AuthModule,
    FormsModule,
    ListsModule,
    RchilliModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
