import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TasksTemplate } from 'src/models/tasks.template.model';
import { Tasks } from 'src/models/task.model';
import { CreateTask } from 'src/tasks/dto/create';
import { CreateTaskTemplate } from 'src/tasks/dto/create.template';
import * as constant from '../utils/constant';

export class TaskRepository {
  constructor(
    @InjectModel(TasksTemplate.name)
    private readonly taskTemplateModel: Model<TasksTemplate>,
    @InjectModel(Tasks.name)
    private readonly taskModel: Model<Tasks>,
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

  async getTemplateByName(name: string): Promise<TasksTemplate> {
    try {
      const response = await this.taskTemplateModel.findOne({ name });
      return response;
    } catch (error) {
      throw new HttpException(
        `Template ${constant.ERROR_ELEMENT_NOT_FOUND}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getAllTemplates(): Promise<TasksTemplate[]> {
    try {
      const response = await this.taskTemplateModel.find({});
      return response;
    } catch (error) {
      throw new HttpException(
        `Templates ${constant.ERROR_ELEMENT_NOT_FOUND}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getTaskByUserAndName(params) {
    try {
      const response = await this.taskModel.find(params);
      return response;
    } catch (error) {
      throw new HttpException(
        `Templates ${constant.ERROR_ELEMENT_NOT_FOUND}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getTaskByUserAndWorkspace(params) {
    const { user: createdBy, workspace } = params;
    try {
      const response = await this.taskModel.find({ createdBy, workspace });
      return response;
    } catch (error) {
      throw new HttpException(
        `Task ${constant.ERROR_ELEMENT_NOT_FOUND}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getTaskById(id) {
    try {
      const response = await this.taskModel.findById(id);
      return response;
    } catch (error) {
      throw new HttpException(
        `Task ${constant.ERROR_ELEMENT_NOT_FOUND}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async createTaskToUser(createTask: CreateTask) {
    const { user, ...task } = createTask;
    const taskUser = { createdBy: user, ...task };
    try {
      const newTask = new this.taskModel(taskUser);
      const response = await newTask.save();
      return response;
    } catch (error) {
      throw new HttpException(
        `Task ${constant.ERROR_ELEMENT_NOT_CREATED}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
