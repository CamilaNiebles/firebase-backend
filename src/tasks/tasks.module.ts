import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TasksTemplate,
  TaskTemplateSchema,
} from 'src/models/tasks.template.model';
import { TaskRepository } from 'src/repositories/tasks.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TasksTemplate.name, schema: TaskTemplateSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
})
export class TasksModule {}
