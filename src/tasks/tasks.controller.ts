import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CreateTask } from './dto/create';
import { CreateTaskTemplate } from './dto/create.template';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post('/template')
  async createTemplate(
    @Body() createTemplate: CreateTaskTemplate,
    @Res() res: any,
  ) {
    try {
      const response = await this.taskService.createTemplate(createTemplate);
      return res.status(HttpStatus.CREATED).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }
  @Get('/configuration/:name')
  async getConfiguraion(
    @Param('name')
    name: string,
    @Res() res: any,
  ) {
    try {
      const response = await this.taskService.getTemplateByName(name);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }

  @Post()
  async createTaskToUser(@Body() createTask: CreateTask, @Res() res: any) {
    try {
      const response = await this.taskService.createTaskToUser(createTask);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }

  @Get('/:user')
  async getTaskByUser(
    @Param('user')
    user: string,
    @Res() res: any,
  ) {
    try {
      const response = await this.taskService.getAllTaskByUser(user);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      return res.status(error.status).send(error.message);
    }
  }
}
