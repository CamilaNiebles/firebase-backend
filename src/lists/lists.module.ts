import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListSchema } from 'src/models/list.model';
import { ListRepository } from 'src/repositories/list.repository';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'List', schema: ListSchema }])],
  controllers: [ListsController],
  providers: [ListsService, ListRepository],
})
export class ListsModule {}
