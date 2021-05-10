import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TasksTemplate } from 'src/models/tasks.template.model';
import { CreateTaskTemplate } from 'src/tasks/dto/create.template';
import * as constant from '../utils/constant';

export class TaskRepository {
  constructor(
    @InjectModel(TasksTemplate.name)
    private readonly taskTemplateModel: Model<TasksTemplate>,
  ) {}

  async createTemplate(createTemplate: CreateTaskTemplate) {
    try {
      const newTemplate = new this.taskTemplateModel(createTemplate);
      const response = await newTemplate.save();
      return response;
    } catch (e) {
      throw new HttpException(
        constant.ERROR_CREATING_TASK,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTemplateByName(name: string) {
    try {
      return this.taskTemplateModel.findOne({ name });
    } catch (error) {
      throw new HttpException(
        `Template ${constant.ERROR_ELEMENT_NOT_FOUND}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
