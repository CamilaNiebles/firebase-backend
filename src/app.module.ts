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
import { GoogleModule } from './google/google.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DATABASE_SHARDED),
    UserModule,
    AuthModule,
    FormsModule,
    ListsModule,
    RchilliModule,
    TasksModule,
    GoogleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
