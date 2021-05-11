import { Injectable } from '@nestjs/common';
import { TaskRepository } from 'src/repositories/tasks.repository';
import { CreateTaskTemplate } from './dto/create.template';
import { uuid } from 'uuidv4';
import { CreateTask } from './dto/create';
import { TasksTemplate } from 'src/models/tasks.template.model';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTemplate(createTemplate: CreateTaskTemplate) {
    const templateWithIds = this.addIdtoVariables(createTemplate);
    return this.taskRepository.createTemplate(templateWithIds);
  }

  async getTemplateByName(name: string) {
    return this.taskRepository.getTemplateByName(name);
  }

  async createTaskToUser(createTask: CreateTask) {
    return this.taskRepository.createTaskToUser(createTask);
  }

  async getAllTaskByUser(user: string) {
    const promiseArray = [];
    const allTemplates = await this.taskRepository.getAllTemplates();
    allTemplates.forEach((e) => {
      const { name } = e;
      promiseArray.push(
        this.taskRepository.getTaskByUserAndName({
          name,
          createdBy: user,
        }),
      );
    });
    const tasks = await Promise.all(promiseArray);
    const response = this.countTasksByType(allTemplates, tasks);
    return response;
  }

  addIdtoVariables(template) {
    let { variables, ...newTemplate } = template;
    const newVariables = variables.map((e) => {
      e.id = uuid();
      return e;
    });
    newTemplate.variables = newVariables;
    return newTemplate;
  }

  countTasksByType(allTemplates: TasksTemplate[], taskUser) {
    const response = [];
    let template: any;
    for (template of allTemplates) {
      let tasksIds = [];
      const { name, displayName } = template;
      taskUser.forEach((e) => {
        if (e.length) {
          tasksIds = e.map((element) => {
            return element._id;
          });
        }
      });
      response.push({
        name,
        displayName,
        total: tasksIds.length,
        tasks: tasksIds,
      });
    }
    return response;
  }
}
