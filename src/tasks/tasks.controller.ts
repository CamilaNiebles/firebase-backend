import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateTaskTemplate } from './dto/create.template';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post()
  async createTemplate(
    @Body() createTemplate: CreateTaskTemplate,
    @Res() res: any,
  ) {
    try {
      const response = this.taskService.createTemplate(createTemplate);
      return res.status(HttpStatus.CREATED).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }
}
